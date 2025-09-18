import type { Handler } from "@netlify/functions";
import {
  NATURVERSITY_QUIZ_SAFETY_RULES,
  NATURVERSITY_QUIZ_SYSTEM_PROMPT,
  buildNaturversityQuizUserPrompt,
  clampNaturversityQuizAge,
} from "../../src/lib/ai/promptSchemas";
import type { NaturversityQuizItem } from "../../src/lib/ai/promptSchemas";

type SchemaKey =
  | "name"
  | "species"
  | "kingdom"
  | "backstory"
  | "title"
  | "intro"
  | "outline"
  | "activities"
  | "quiz"
  | "topic"
  | "age";
type LessonSchema = SchemaKey[];

const MODEL = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";
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
    case "naturversity.quiz": {
      const topic = String(input?.topic ?? "").slice(0, 200);
      const age = clampNaturversityQuizAge(Number(input?.age ?? 0) || 0);
      const outlineRaw = Array.isArray(input?.outline) ? (input?.outline as unknown[]) : [];
      const outline = outlineRaw
        .map((entry) => String(entry ?? "").slice(0, 200))
        .filter((entry) => entry.length > 0)
        .slice(0, 8);
      return {
        schema: ["topic", "age", "quiz"],
        system: `${NATURVERSITY_QUIZ_SYSTEM_PROMPT}\n${NATURVERSITY_QUIZ_SAFETY_RULES}`,
        user: buildNaturversityQuizUserPrompt(topic, age, outline),
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

const sanitizeString = (value: unknown, limit = 320) => String(value ?? "").trim().slice(0, limit);

type Sanitized = Record<string, string | number | string[] | NaturversityQuizItem[]>;

function sanitizeBySchema(schema: LessonSchema, value: Record<string, unknown>): Sanitized {
  const clean: Sanitized = {};
  for (const key of schema) {
    const raw = value[key];

    if (key === "age") {
      const num = Number(raw ?? 0);
      clean[key] = clampNaturversityQuizAge(Number.isFinite(num) ? num : 0);
      continue;
    }

    if (key === "quiz") {
      const source = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as any)?.items)
          ? ((raw as any)?.items as unknown[])
          : [];
      const items: NaturversityQuizItem[] = source
        .slice(0, 3)
        .map((entry) => {
          if (typeof entry === "object" && entry !== null) {
            const record = entry as Record<string, unknown>;
            const q = sanitizeString(record.q, 320);
            const a = sanitizeString(record.a, 160);
            const choices = Array.isArray(record.choices)
              ? (record.choices as unknown[])
                  .map((choice) => sanitizeString(choice, 80))
                  .filter((choice) => choice.length > 0)
                  .slice(0, 6)
              : [];
            const item: NaturversityQuizItem = { q, a };
            if (choices.length >= 2) {
              if (!choices.includes(a)) choices.push(a);
              item.choices = Array.from(new Set(choices)).slice(0, 6);
            }
            return item;
          }
          return { q: sanitizeString(entry, 320), a: "" };
        })
        .filter((item) => item.q.length > 0);
      clean[key] = items;
      continue;
    }

    if (Array.isArray(raw)) {
      const limit = key === "outline" ? 3 : key === "activities" ? 2 : raw.length;
      clean[key] = raw
        .slice(0, limit)
        .map((entry) => sanitizeString(entry, 320))
        .filter((entry) => entry.length > 0);
      continue;
    }

    clean[key] = sanitizeString(raw, 800);
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
      temperature: 0.6,
      messages: [
        { role: "system", content: cfg.system },
        { role: "user", content: cfg.user },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    return bad(`Groq error ${response.status}`, response.status);
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
  let result: unknown = clean;

  if (kind === "naturversity.quiz") {
    const topicRaw = (clean as Record<string, unknown>).topic;
    const ageRaw = (clean as Record<string, unknown>).age;
    const quizRaw = (clean as Record<string, unknown>).quiz;
    const topic = sanitizeString(topicRaw, 120);
    const age = clampNaturversityQuizAge(
      typeof ageRaw === "number" ? ageRaw : Number(ageRaw ?? 0)
    );
    const items = Array.isArray(quizRaw)
      ? (quizRaw as NaturversityQuizItem[]).map((item) => {
          const base: NaturversityQuizItem = {
            q: sanitizeString(item.q, 320),
            a: sanitizeString(item.a, 160),
          };
          if (Array.isArray(item.choices)) {
            const choices = item.choices
              .map((choice) => sanitizeString(choice, 80))
              .filter((choice) => choice.length > 0);
            if (!choices.includes(base.a)) choices.push(base.a);
            const unique = Array.from(new Set(choices)).slice(0, 6);
            if (unique.length >= 2) base.choices = unique;
          }
          return base;
        })
      : [];

    result = { topic, age, items };
  }

  cache.set(cacheKey, { t: now, v: result });
  return ok(result);
};

export default handler;
