import type { Handler } from "@netlify/functions";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function json(body: Record<string, unknown> | string, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...cors() },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

type RequestBody = {
  prompt?: unknown;
  size?: unknown;
};

type ApiSuccess = { ok: true; provider: "openai"; dataUrl: string };
type ApiError = { ok: false; code: string; error: string };

function parseSize(raw: unknown) {
  if (!raw || typeof raw !== "string") return "1024x1024";
  const [w, h] = raw.toLowerCase().split("x");
  const width = Number.parseInt(w, 10);
  const height = Number.parseInt(h, 10);
  const clamp = (value: number) => Math.max(256, Math.min(2048, Math.floor(value)));
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return "1024x1024";
  }
  return `${clamp(width)}x${clamp(height)}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json("", 204);
  }

  try {
    const API_KEY = process.env.OPENAI_API_KEY || "";
    if (!API_KEY) {
      return json({ ok: false, code: "openai_missing_key", error: "Missing OPENAI_API_KEY" }, 500);
    }

    let body: RequestBody;
    try {
      body = JSON.parse(event.body || "{}") as RequestBody;
    } catch {
      return json({ ok: false, code: "openai_invalid_body", error: "Invalid JSON body" }, 400);
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return json({ ok: false, code: "openai_missing_prompt", error: "Missing prompt" }, 400);
    }

    const size = parseSize(body.size);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return json(
        {
          ok: false,
          code: `openai_${res.status}`,
          error: raw || "OpenAI error",
        },
        res.status,
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ ok: false, code: "openai_invalid_response", error: "Invalid JSON response" }, 502);
    }

    const b64: string | undefined = parsed?.data?.[0]?.b64_json;
    if (!b64) {
      return json({ ok: false, code: "openai_no_image", error: "No image in response" }, 502);
    }

    const dataUrl = `data:image/png;base64,${b64}`;
    const payload: ApiSuccess = { ok: true, provider: "openai", dataUrl };
    return json(payload);
  } catch (err: any) {
    const message = String(err?.message || err);
    const payload: ApiError = { ok: false, code: "openai_exception", error: message };
    return json(payload, 500);
  }
};
