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

const MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";
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
          "You write short, kid-friendly nature lessons. Return JSON with title, intro (1 paragraph), outline (3 bullets), activities (2 short items), quiz (3 Q&A). No extra text.",
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

type Sanitized = Record<string, string | string[] | { q: string; a: string }[]>;

function sanitizeBySchema(schema: LessonSchema, value: Record<string, unknown>): Sanitized {
  const clean: Sanitized = {};
  for (const key of schema) {
    const raw = value[key];
    if (Array.isArray(raw)) {
      if (key === "quiz") {
        clean[key] = raw
          .slice(0, 3)
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              const q = String((item as Record<string, unknown>).q ?? "").slice(0, 320);
              const a = String((item as Record<string, unknown>).a ?? "").slice(0, 320);
              return { q, a };
            }
            return { q: String(item ?? "").slice(0, 320), a: "" };
          })
          .filter((item) => item.q.length > 0);
      } else {
        const limit = key === "outline" ? 3 : key === "activities" ? 2 : raw.length;
        clean[key] = raw
          .slice(0, limit)
          .map((entry) => String(entry ?? "").slice(0, 320))
          .filter((entry) => entry.length > 0);
      }
    } else {
      clean[key] = String(raw ?? "").slice(0, 800);
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
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: cfg.system },
        { role: "user", content: cfg.user },
      ],
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq error:", errorText || response.statusText);
    return bad(errorText || "Groq request failed", 500);
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
