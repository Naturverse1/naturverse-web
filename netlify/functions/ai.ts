import type { Handler } from "@netlify/functions";
import { z } from "zod";

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
};

const OPTIONS_HEADERS = {
  ...HEADERS,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const API_KEY = process.env.GROQ_API_KEY;

const systemByAction = {
  lesson:
    "You are Turian. Write a short kid-friendly mini-lesson (title, intro, 3-bullet outline, 2 activities). Return ONLY JSON: {title, intro, outline:[...], activities:[...]}.",
  quiz:
    "Create 3 kid-friendly multiple-choice questions (A–D) about the given topic. Return ONLY JSON: {questions:[{q, options:[\"A\",\"B\",\"C\",\"D\"], answer:\"A\"}]}.",
  card:
    "From this short description, suggest {name, species, kingdom, backstory}. Return ONLY JSON with those keys.",
  backstory:
    "Write a 2–3 sentence playful backstory for a kids character. Return ONLY JSON: {backstory}.",
} as const;

const payloadSchema = z.object({
  action: z
    .enum([
      "lesson",
      "quiz",
      "card",
      "backstory",
      "buildLesson",
      "suggestBackstory",
      "generateCard",
    ])
    .optional(),
  prompt: z.string().trim().min(1, "prompt required").optional(),
  topic: z.string().optional(),
  age: z.union([z.number(), z.string()]).optional(),
});

type Payload = z.infer<typeof payloadSchema>;
type NormalizedAction = keyof typeof systemByAction;

const ACTION_MAP: Record<NonNullable<Payload["action"]>, NormalizedAction> = {
  lesson: "lesson",
  quiz: "quiz",
  card: "card",
  backstory: "backstory",
  buildLesson: "lesson",
  suggestBackstory: "backstory",
  generateCard: "card",
};

class HttpError extends Error {
  status: number;
  detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function json(payload: Record<string, unknown>, statusCode = 200) {
  return {
    statusCode,
    headers: HEADERS,
    body: JSON.stringify(payload),
  };
}

function parseAge(age: Payload["age"]): number | null {
  if (typeof age === "number" && Number.isFinite(age)) {
    return age;
  }

  if (typeof age === "string") {
    const numeric = Number(age);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return null;
}

async function callGroq(action: NormalizedAction, prompt: string, age: number | null) {
  const systemPrompt = systemByAction[action];
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new HttpError(400, "Prompt is required");
  }

  const userContent =
    age !== null && action === "lesson"
      ? `${trimmedPrompt}\nAge: ${Math.round(age)}`
      : trimmedPrompt;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new HttpError(response.status, "Groq error", text);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new HttpError(502, "Invalid response from Groq");
  }

  const content = parsed?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new HttpError(502, "No content from model");
  }

  const jsonText = content.replace(/^```json\s*|\s*```$/g, "");
  try {
    return JSON.parse(jsonText);
  } catch {
    throw new HttpError(502, "Non-JSON content from model", content);
  }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: OPTIONS_HEADERS,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    if (!API_KEY) {
      return json({ ok: false, error: "Missing GROQ_API_KEY" }, 500);
    }

    if (!event.body) {
      return json({ ok: false, error: "Missing body" }, 400);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(event.body);
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const parsed = payloadSchema.safeParse(raw);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: "Bad request",
          detail: parsed.error.flatten(),
        },
        400,
      );
    }

    const { action, prompt, topic, age } = parsed.data;
    const normalized = action ? ACTION_MAP[action] : null;

    if (!normalized) {
      return json({ ok: false, error: "Unsupported action" }, 400);
    }

    const basePrompt =
      normalized === "lesson"
        ? (prompt ?? topic ?? "")
        : (prompt ?? "");

    const result = await callGroq(normalized, basePrompt, parseAge(age));
    return json({ ok: true, data: result });
  } catch (err: any) {
    if (err instanceof HttpError) {
      return json({ ok: false, error: err.message, detail: err.detail }, err.status);
    }

    const msg = err?.response?.data ?? err?.message ?? "Unknown error";
    const status = err?.response?.status ?? 502;
    return json({ ok: false, error: "Upstream failure", detail: msg }, status);
  }
};

export default handler;
