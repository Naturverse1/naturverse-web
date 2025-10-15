import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
} as const;

const OPENAI_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-1";

interface RequestBody {
  prompt?: string;
  size?: number;
  model?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(204);
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return respond(500, { error: "missing_openai_api_key" });
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normaliseString(payload.prompt);
  if (!prompt) {
    return respond(400, { error: "missing_prompt" });
  }

  const size = normaliseSize(payload.size);
  const model = normaliseString(payload.model) || DEFAULT_MODEL;

  const requestPayload = {
    model,
    prompt,
    size: `${size}x${size}`,
    response_format: "b64_json"
  };

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload)
    });

    const rawText = await response.text();
    let raw: any = null;

    try {
      raw = JSON.parse(rawText);
    } catch {
      raw = null;
    }

    if (!response.ok) {
      return respond(response.status, {
        error: "openai_error",
        details: raw?.error?.message || "unknown error"
      });
    }

    const entries = Array.isArray(raw?.data) ? raw.data : [];
    for (const entry of entries) {
      if (entry && typeof entry.b64_json === "string") {
        return respond(200, {
          imageUrl: `data:image/png;base64,${entry.b64_json}`,
          provider: "openai"
        });
      }
    }

    return respond(502, { error: "no_image_returned" });

  } catch (error: any) {
    return respond(500, {
      error: "openai_unexpected",
      details: error?.message || "unknown_error"
    });
  }
};

// ---------- Utility functions ----------

function respond(statusCode: number, payload?: Record<string, any>) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: payload ? JSON.stringify(payload) : ""
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
