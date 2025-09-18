import type { Handler } from "@netlify/functions";
import { ZodError, z } from "zod";

type LegacySchemaKey =
  | "name"
  | "species"
  | "kingdom"
  | "backstory"
  | "title"
  | "intro"
  | "outline"
  | "activities"
  | "quiz";

type LegacyLessonSchema = LegacySchemaKey[];

type LegacyPromptConfig = {
  schema: LegacyLessonSchema;
  system: string;
  user: string;
};

type Sanitized = Record<string, string | string[] | { q: string; a: string }[]>;

type CacheEntry = { t: number; v: unknown };

declare global {
  // eslint-disable-next-line no-var
  var __aiCache: Map<string, CacheEntry> | undefined;
}

const GROQ_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
const TTL_MS = 1000 * 60 * 30; // 30 minutes

const JSON_HEADERS: Record<string, string> = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
};

const OPTIONS_HEADERS: Record<string, string> = {
  ...JSON_HEADERS,
  "access-control-allow-methods": "POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

const QuizSchema = z.object({
  questions: z.array(
    z.object({
      q: z.string(),
      options: z.array(z.string()).length(4),
      answer: z.enum(["A", "B", "C", "D"]),
    }),
  ),
});

const LessonPlanSchema = z.object({
  title: z.string(),
  age: z.number(),
  intro: z.string(),
  outline: z.array(z.string()),
  activities: z.array(z.string()),
});

const CardSchema = z.object({
  name: z.string(),
  species: z.string(),
  kingdom: z.string(),
  backstory: z.string(),
  powers: z.array(z.string()).optional(),
  traits: z.array(z.string()).optional(),
});

const systemByAction = {
  quiz: "You are Turian. Create a 3-question multiple-choice quiz (A–D) for kids.\nReturn ONLY JSON: {questions:[{q,options:[A,B,C,D],answer}]}",
  lesson: "You are Turian. Create a lesson plan.\nReturn ONLY JSON: {title,age,intro,outline[],activities[]}",
  card: "You are Turian. Turn this into a character card.\nReturn ONLY JSON: {name,species,kingdom,backstory,powers[],traits[]}",
} as const;

type Action = keyof typeof systemByAction;

type ActionBody = {
  action?: unknown;
  prompt?: unknown;
  age?: unknown;
};

type LegacyBody = {
  kind?: unknown;
  input?: unknown;
};

const schemaByAction: Record<Action, z.ZodTypeAny> = {
  quiz: QuizSchema,
  lesson: LessonPlanSchema,
  card: CardSchema,
};

const chatUrl = "https://api.groq.com/openai/v1/chat/completions";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return new Response("", { status: 204, headers: OPTIONS_HEADERS });
  }

  if (event.httpMethod !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  if (!GROQ_KEY) {
    return errorResponse("Server missing GROQ_API_KEY", 500);
  }

  let body: unknown;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!body || typeof body !== "object") {
    return errorResponse("Invalid JSON body", 400);
  }

  const payload = body as Record<string, unknown>;

  if ("action" in payload) {
    return handleActionRequest(payload as ActionBody);
  }

  return handleLegacyRequest(payload as LegacyBody);
};

export default handler;

function successResponse(data: unknown, status = 200): Response {
  return jsonResponse({ ok: true, data }, status);
}

function errorResponse(error: string, status = 400, extra?: Record<string, unknown>): Response {
  return jsonResponse({ ok: false, error, ...(extra ?? {}) }, status);
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

function getCache(): Map<string, CacheEntry> {
  if (!globalThis.__aiCache) {
    globalThis.__aiCache = new Map<string, CacheEntry>();
  }
  return globalThis.__aiCache;
}

async function handleActionRequest(body: ActionBody): Promise<Response> {
  const action = typeof body.action === "string" ? (body.action as Action) : undefined;
  const promptRaw = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const ageValue = typeof body.age === "number" && Number.isFinite(body.age) ? body.age : undefined;

  if (!action || !isAction(action) || !promptRaw) {
    return errorResponse("Missing action or prompt", 400);
  }

  const system = systemByAction[action];
  const schema = schemaByAction[action];
  const prompt = promptRaw.slice(0, 4000);
  const userMessage = ageValue !== undefined ? `${prompt} (age ${ageValue})` : prompt;

  try {
    const { response, text } = await callGroq(
      [
        { role: "system", content: system },
        { role: "user", content: userMessage },
      ],
      { temperature: 0.4, maxTokens: 800, responseFormat: { type: "json_object" } },
    );

    if (!response.ok) {
      return errorResponse("Groq request failed", response.status, {
        status: response.status,
        detail: text,
      });
    }

    const parsedContent = parseGroqResponse(text);
    if (!parsedContent.ok) {
      return errorResponse(parsedContent.error, parsedContent.status, {
        detail: parsedContent.detail,
      });
    }

    const raw = extractJsonFromContent(parsedContent.content);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return errorResponse("Model did not return valid JSON", 502, {
        content: parsedContent.content,
      });
    }

    try {
      const cleaned = schema.parse(parsed);
      return successResponse(cleaned);
    } catch (err) {
      if (err instanceof ZodError) {
        return errorResponse("Model response validation failed", 502, {
          detail: err.issues,
        });
      }
      throw err;
    }
  } catch (err) {
    return errorResponse("Server error", 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

async function handleLegacyRequest(body: LegacyBody): Promise<Response> {
  const kind = typeof body.kind === "string" ? body.kind : "";
  const input = isRecord(body.input) ? (body.input as Record<string, unknown>) : null;

  if (!kind) {
    return errorResponse("Missing kind", 400);
  }

  let cfg: LegacyPromptConfig;
  try {
    cfg = buildLegacyPrompt(kind, input ?? {});
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unsupported kind", 400);
  }

  const cache = getCache();
  const cacheKey = `${kind}:${JSON.stringify(input ?? {})}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now - cached.t < TTL_MS) {
    return successResponse(cached.v);
  }

  try {
    const { response, text } = await callGroq(
      [
        { role: "system", content: cfg.system },
        { role: "user", content: cfg.user },
      ],
      { temperature: 0.6, maxTokens: 800, responseFormat: { type: "json_object" } },
    );

    if (!response.ok) {
      return errorResponse("Groq request failed", response.status, {
        status: response.status,
        detail: text,
      });
    }

    const parsedContent = parseGroqResponse(text);
    if (!parsedContent.ok) {
      return errorResponse(parsedContent.error, parsedContent.status, {
        detail: parsedContent.detail,
      });
    }

    const raw = extractJsonFromContent(parsedContent.content);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return errorResponse("Groq returned invalid JSON", 502, {
        content: parsedContent.content,
      });
    }

    if (!parsed || typeof parsed !== "object") {
      return errorResponse("Groq returned invalid JSON", 502, {
        content: parsedContent.content,
      });
    }

    const clean = sanitizeBySchema(cfg.schema, parsed as Record<string, unknown>);
    cache.set(cacheKey, { t: now, v: clean });
    return successResponse(clean);
  } catch (err) {
    return errorResponse("Server error", 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

function isAction(value: string): value is Action {
  return value in systemByAction;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function callGroq(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options: { temperature: number; maxTokens: number; responseFormat?: Record<string, unknown> },
): Promise<{ response: Response; text: string }> {
  const response = await fetch(chatUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      messages,
      ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
    }),
  });

  const text = await response.text();
  return { response, text };
}

type GroqParseResult =
  | { ok: true; content: string }
  | { ok: false; status: number; error: string; detail: string };

function parseGroqResponse(text: string): GroqParseResult {
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Groq returned non-JSON response",
      detail: text,
    };
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return {
      ok: false,
      status: 502,
      error: "Groq returned no content",
      detail: text,
    };
  }

  return { ok: true, content };
}

function extractJsonFromContent(content: string): string {
  const match = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (match ? match[1] : content).trim();
}

function buildLegacyPrompt(kind: string, input: Record<string, unknown> | null | undefined): LegacyPromptConfig {
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

function sanitizeBySchema(schema: LegacyLessonSchema, value: Record<string, unknown>): Sanitized {
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
