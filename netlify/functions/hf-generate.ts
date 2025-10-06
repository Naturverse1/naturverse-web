import type { Handler } from "@netlify/functions";

const DEFAULT_MODEL = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";

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

type ApiSuccess = { ok: true; provider: "huggingface"; dataUrl: string };
type ApiError = { ok: false; code: string; error: string };

function parseSize(raw: unknown) {
  if (!raw || typeof raw !== "string") return "1024x1024";
  const [w, h] = raw.toLowerCase().split("x");
  const width = Number.parseInt(w, 10);
  const height = Number.parseInt(h, 10);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return "1024x1024";
  }
  const clamp = (value: number) => Math.max(256, Math.min(2048, Math.floor(value)));
  return `${clamp(width)}x${clamp(height)}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json("", 204);
  }

  try {
    const API_KEY = process.env.HF_API_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
    if (!API_KEY) {
      return json({ ok: false, code: "huggingface_missing_key", error: "Missing HF_API_TOKEN" }, 500);
    }

    let body: RequestBody;
    try {
      body = JSON.parse(event.body || "{}") as RequestBody;
    } catch {
      return json({ ok: false, code: "huggingface_invalid_body", error: "Invalid JSON body" }, 400);
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return json({ ok: false, code: "huggingface_missing_prompt", error: "Missing prompt" }, 400);
    }

    const size = parseSize(body.size);

    const res = await fetch(`https://api-inference.huggingface.co/models/${DEFAULT_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/*",
      },
      body: JSON.stringify({ inputs: prompt, parameters: { size } }),
    });

    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      const lowered = errTxt.toLowerCase();
      const code = lowered.includes("rate limit") || lowered.includes("quota") ? "huggingface_quota" : `huggingface_${res.status}`;
      return json({ ok: false, code, error: errTxt || "Hugging Face error" }, res.status);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      const raw = await res.text().catch(() => "");
      return json({ ok: false, code: "huggingface_unexpected", error: raw || "Unexpected response" }, 502);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const payload: ApiSuccess = {
      ok: true,
      provider: "huggingface",
      dataUrl: `data:image/png;base64,${buf.toString("base64")}`,
    };
    return json(payload);
  } catch (err: any) {
    const payload: ApiError = {
      ok: false,
      code: "huggingface_exception",
      error: String(err?.message || err),
    };
    return json(payload, 500);
  }
};
