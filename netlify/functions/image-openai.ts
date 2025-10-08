import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
} as const;

const OPENAI_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-1";

interface RequestBody {
  prompt?: string;
  size?: string | number;
  model?: string;
  quality?: string;
  style?: string;
  user?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return respond(204);
  if (event.httpMethod !== "POST") return respond(405, { error: "method_not_allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return respond(500, { error: "missing_api_key" });

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normaliseString(payload.prompt);
  if (!prompt) return respond(400, { error: "missing_prompt" });

  const size = normaliseSize(payload.size) || 1024;
  const model = normaliseString(payload.model) || DEFAULT_MODEL;

  const requestPayload: Record<string, unknown> = {
    model,
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
      body: JSON.stringify(requestPayload),
    });

    const rawText = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }

    if (!response.ok) {
      const details = data?.error?.message || rawText || "openai_request_failed";
      return respond(response.status, { error: "openai_error", details });
    }

    const entry = data?.data?.[0];
    if (entry?.b64_json) {
      return respond(200, {
        imageUrl: `data:image/png;base64,${entry.b64_json}`,
        provider: "openai",
      });
    }
    if (entry?.url) {
      return respond(200, {
        imageUrl: entry.url,
        provider: "openai",
      });
    }

    return respond(502, { error: "openai_no_image_returned" });
  } catch (error: any) {
    return respond(500, {
      error: "openai_unexpected",
      details: error?.message || String(error),
    });
  }
};

function respond(statusCode: number, payload?: any) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: payload ? JSON.stringify(payload) : "",
  };
}

function normaliseString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normaliseSize(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return clamp(value);
  if (typeof value === "string") {
    const numeric = Number.parseInt(value, 10);
    if (Number.isFinite(numeric)) return clamp(numeric);
  }
  return 1024;
}

function clamp(value: number) {
  const allowed = [256, 512, 1024, 2048];
  for (const option of allowed) {
    if (value <= option) return option;
  }
  return allowed[allowed.length - 1];
}
