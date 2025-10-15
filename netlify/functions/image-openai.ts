import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

// ✅ Correct image generation endpoint
const OPENAI_URL = "https://api.openai.com/v1/images/generations";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return respond(204);

  if (event.httpMethod !== "POST")
    return respond(405, { error: "method_not_allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return respond(500, { error: "missing_openai_api_key" });

  let body: any;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normaliseString(body.prompt);
  if (!prompt) return respond(400, { error: "missing_prompt" });

  const size = normaliseSize(body.size);

  // ✅ Minimal valid payload for image generation
  const payload = {
    model: "gpt-image-1",
    prompt,
    size: `${size}x${size}`,
  };

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      return respond(502, { error: "invalid_json_from_openai" });
    }

    if (!response.ok) {
      return respond(response.status, {
        error: data?.error?.message || "openai_error",
      });
    }

    const imageBase64 = data?.data?.[0]?.b64_json;
    if (!imageBase64)
      return respond(502, { error: "no_image_returned_from_openai" });

    return respond(200, {
      imageUrl: `data:image/png;base64,${imageBase64}`,
      provider: "openai",
    });
  } catch (err: any) {
    return respond(500, { error: "openai_unexpected", details: err.message });
  }
};

// ---------- Utilities ----------

function respond(statusCode: number, payload?: Record<string, any>) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: payload ? JSON.stringify(payload) : "",
  };
}

function normaliseString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normaliseSize(value: unknown): number {
  const allowed = [256, 512, 1024, 2048];
  let numeric: number = 512;
  if (typeof value === "number" && Number.isFinite(value)) numeric = value;
  if (typeof value === "string") {
    const parsed = parseInt(value);
    if (Number.isFinite(parsed)) numeric = parsed;
  }
  for (const option of allowed) {
    if (numeric <= option) return option;
  }
  return allowed[allowed.length - 1];
}
