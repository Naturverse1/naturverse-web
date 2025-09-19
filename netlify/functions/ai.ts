import type { Handler } from "@netlify/functions";

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

type Body = {
  action: "lesson" | "quiz" | "card" | "backstory";
  prompt: string;
  age?: number;
};

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

function respond(statusCode: number, payload: Record<string, unknown>) {
  return {
    statusCode,
    headers: HEADERS,
    body: JSON.stringify(payload),
  };
}

const ok = (data: unknown) => respond(200, { ok: true, data });
const bad = (statusCode: number, error: unknown) =>
  respond(statusCode, { ok: false, error: typeof error === "string" ? error : String(error) });

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
      return bad(405, "Method not allowed");
    }

    if (!API_KEY) {
      return bad(500, "Missing GROQ_API_KEY");
    }

    let body: Body;
    try {
      body = JSON.parse(event.body || "{}") as Body;
    } catch {
      return bad(400, "Invalid JSON body");
    }

    if (!body || !body.action || !(body.action in systemByAction)) {
      return bad(400, "Unsupported action");
    }

    const prompt = String(body.prompt ?? "").trim();
    if (!prompt) {
      return bad(400, "Prompt is required");
    }

    const systemPrompt = systemByAction[body.action];
    const userContent = body.age && Number.isFinite(body.age)
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
      return bad(groqRes.status, `Groq error: ${text}`);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return bad(502, "Invalid response from Groq");
    }

    const content = parsed?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return bad(502, "No content from model");
    }

    const jsonText = content.replace(/^```json\s*|\s*```$/g, "");
    try {
      const data = JSON.parse(jsonText);
      return ok(data);
    } catch {
      return bad(502, `Non-JSON content from model: ${content}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return bad(500, `Unhandled error: ${message}`);
  }
};

export default handler;
