import type { Handler } from "@netlify/functions";

type SchemaKey =
  | "name"
  | "species"
  | "kingdom"
  | "backstory"
  | "title"
  | "intro"
  | "outline"
  | "activities"
  | "quiz";
type LessonSchema = SchemaKey[];

const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const API_KEY = process.env.GROQ_API_KEY;
const TTL_MS = 1000 * 60 * 30; // 30 minutes

type CacheEntry = { t: number; v: unknown };

declare global {
  // eslint-disable-next-line no-var
  var __aiCache: Map<string, CacheEntry> | undefined;
}

const ok = (data: unknown) => ({
  statusCode: 200,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  },
  body: JSON.stringify({ ok: true, data }),
});

const bad = (message: string, statusCode = 400) => ({
  statusCode,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  },
  body: JSON.stringify({ ok: false, error: message }),
});

type RequestBody = {
  kind?: string;
  input?: Record<string, unknown> | null;
};

type PromptConfig = {
  schema: LessonSchema;
  system: string;
  user: string;
};

function buildPrompt(kind: string, input: Record<string, unknown> | null | undefined): PromptConfig {
  switch (kind) {
    case "navatar.card": {
      const description = String(input?.description ?? "").slice(0, 2000);
      return {
        schema: ["name", "species", "kingdom", "backstory"],
        system:
          "You are Turian, a friendly kids guide. Return concise JSON only with keys: name, species, kingdom, backstory. Keep it positive and G-rated.",
        user: `Describe a fun character from this description:\n${description}`,
      };
    }
    case "naturversity.lesson": {
      const topic = String(input?.topic ?? "").slice(0, 200);
      const age = Number(input?.age ?? 0) || 0;
      return {
        schema: ["title", "intro", "outline", "activities", "quiz"],
        system:
          "You write short, kid-friendly nature lessons. Respond only with JSON containing: title (string), intro (single paragraph), outline (array of 3 short bullet strings), activities (array of 2 short activities), and quiz (array of exactly 3 objects each with keys q, options, answer where answer equals one of the options). No markdown or commentary.",
        user: `Topic: ${topic}\nAge: ${age}`,
      };
    }
    default:
      throw new Error("Unknown kind");
  }
}

function getCache(): Map<string, CacheEntry> {
  if (!globalThis.__aiCache) {
    globalThis.__aiCache = new Map<string, CacheEntry>();
  }
  return globalThis.__aiCache;
}

type QuizItem = { q: string; options: string[]; answer: string };

type Sanitized = Record<string, string | string[] | QuizItem[]>;

const sanitizeString = (value: unknown, limit: number) => String(value ?? "").trim().slice(0, limit);

const normalizeOptions = (value: unknown): string[] => {
  const list = Array.isArray(value)
    ? value
    : value && typeof value === "object"
    ? Object.values(value as Record<string, unknown>)
    : [];

  const options: string[] = [];
  for (const entry of list) {
    const text = sanitizeString(entry, 160);
    if (!text) continue;
    const exists = options.some((item) => item.localeCompare(text, undefined, { sensitivity: "accent" }) === 0);
    if (!exists) options.push(text);
    if (options.length >= 4) break;
  }
  return options;
};

function sanitizeQuiz(raw: unknown): QuizItem[] {
  const source = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as Record<string, unknown>).questions)
    ? (raw as Record<string, unknown>).questions
    : [];

  return source
    .slice(0, 3)
    .map((entry) => {
      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        const q = sanitizeString(record.q ?? record.question, 320);
        const options = normalizeOptions(record.options ?? record.choices ?? record.answers);
        let answer = sanitizeString(record.answer ?? record.correct ?? record.solution, 160);

        if (/^[A-D]$/i.test(answer) && options.length > 0) {
          const idx = answer.toUpperCase().charCodeAt(0) - 65;
          if (options[idx]) answer = options[idx];
        }

        if (answer && !options.some((item) => item.localeCompare(answer, undefined, { sensitivity: "accent" }) === 0)) {
          if (options.length < 4) options.push(answer);
        }

        const resolvedAnswer = answer || options[0] || "";
        return { q, options, answer: resolvedAnswer };
      }

      const q = sanitizeString(entry, 320);
      return { q, options: [], answer: "" };
    })
    .filter((item) => item.q.length > 0);
}

function sanitizeBySchema(schema: LessonSchema, value: Record<string, unknown>): Sanitized {
  const clean: Sanitized = {};
  for (const key of schema) {
    const raw = value[key];
    if (key === "quiz") {
      clean[key] = sanitizeQuiz(raw);
      continue;
    }

    if (Array.isArray(raw)) {
      const limit = key === "outline" ? 3 : key === "activities" ? 2 : raw.length;
      clean[key] = raw
        .slice(0, limit)
        .map((entry) => sanitizeString(entry, 320))
        .filter((entry) => entry.length > 0);
    } else {
      clean[key] = sanitizeString(raw, 800);
    }
  }
  return clean;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") return bad("POST only", 405);
  if (!API_KEY) return bad("Server missing GROQ_API_KEY", 500);

  let body: RequestBody;
  try {
    body = JSON.parse(event.body || "{}") as RequestBody;
  } catch (error) {
    return bad("Invalid JSON body");
  }

  const { kind, input } = body;
  if (!kind) return bad("Missing kind");

  let cfg: PromptConfig;
  try {
    cfg = buildPrompt(kind, input ?? {});
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Unsupported kind");
  }

  const cacheKey = `${kind}:${JSON.stringify(input ?? {})}`;
  const cache = getCache();
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.t < TTL_MS) {
    return ok(cached.v);
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: cfg.system },
        { role: "user", content: cfg.user },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const trimmed = detail.replace(/\s+/g, " ").trim().slice(0, 400);
    const message = trimmed ? `Groq error ${response.status}: ${trimmed}` : `Groq error ${response.status}`;
    return bad(message, response.status);
  }

  let payload: any;
  try {
    payload = await response.json();
  } catch (error) {
    return bad("Invalid response from Groq", 502);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return bad("Groq returned no content", 502);
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    return bad("Groq returned invalid JSON", 502);
  }

  const clean = sanitizeBySchema(cfg.schema, parsed);
  cache.set(cacheKey, { t: now, v: clean });
  return ok(clean);
};

export default handler;
