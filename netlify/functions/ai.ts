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

const Body = z.object({
  action: z.enum(["lesson", "quiz", "card", "backstory"]),
  prompt: z.string().min(1, "Prompt is required"),
  age: z.number().optional(),
});

type Body = z.infer<typeof Body>;

const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const API_KEY = process.env.GROQ_API_KEY;

const systemByAction: Record<Body["action"], string> = {
  lesson:
    "You are Turian. Write a short kid-friendly mini-lesson (title, intro, 3-bullet outline, 2 activities). Return ONLY JSON: {title, intro, outline:[...], activities:[...]}.",
  quiz:
    "Create 3 kid-friendly multiple-choice questions (A–D) about the given topic. Return ONLY JSON: {questions:[{q, options:[\"A\",\"B\",\"C\",\"D\"], answer:\"A\"}]}.",
  card:
    "From this short description, suggest {name, species, kingdom, backstory}. Return ONLY JSON with those keys.",
  backstory:
    "Write a 2–3 sentence playful backstory for a kids character. Return ONLY JSON: {backstory}.",
};

function respond(
  statusCode: number,
  payload: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  return {
    statusCode,
    headers: { ...HEADERS, ...extraHeaders },
    body: JSON.stringify(payload),
  };
}

const ok = (data: unknown) => respond(200, { ok: true, data });

const bad = (statusCode: number, message: string, detail?: unknown) =>
  respond(statusCode, { ok: false, error: { message, detail } });

// Normalizers for LLM wobble
function forceStringArray(x: unknown): string[] {
  if (Array.isArray(x)) {
    return x
      .map(item => {
        if (item == null) return "";
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          const value =
            (item as any).title ??
            (item as any).text ??
            (item as any).step ??
            JSON.stringify(item);
          return String(value);
        }
        return String(item);
      })
      .filter(Boolean);
  }
  if (typeof x === "string") return [x];
  return [];
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
      return bad(405, "method_not_allowed");
    }

    if (!API_KEY) {
      return bad(500, "missing_api_key");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(event.body || "{}");
    } catch {
      return bad(400, "invalid_json");
    }

    const parsed = Body.safeParse(parsedJson);
    if (!parsed.success) {
      return bad(400, "invalid_request", parsed.error.flatten());
    }

    const body: Body = parsed.data;

    const prompt = String(body.prompt ?? "").trim();
    if (!prompt) {
      return bad(400, "prompt_required");
    }

    const systemPrompt = systemByAction[body.action];
    const userContent =
      typeof body.age === "number" && Number.isFinite(body.age)
        ? `${prompt}\nAge: ${Math.round(body.age)}`
        : prompt;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    const text = await groqRes.text();
    if (!groqRes.ok) {
      return bad(groqRes.status || 502, "upstream_error", text);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return bad(502, "invalid_response", text);
    }

    const content = parsed?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return bad(502, "empty_content");
    }

    const jsonText = content.replace(/^```json\s*|\s*```$/g, "");
    try {
      const data = JSON.parse(jsonText);

      if (body.action === "lesson") {
        (data as any).activities = forceStringArray((data as any)?.activities);
      }

      return ok(data);
    } catch {
      return bad(502, "non_json_content", content);
    }
  } catch (error) {
    const detail = error instanceof Error ? { message: error.message } : { message: String(error) };
    return bad(500, "unhandled_error", detail);
  }
};

export default handler;
