import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
} as const;

const OPENAI_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-1";

interface RequestBody {
  prompt?: unknown;
  size?: unknown;
  model?: unknown;
  quality?: unknown;
  style?: unknown;
  user?: unknown;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(204);
  }

  if (event.httpMethod !== "POST") {
    return respond(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BEARER || "";
  if (!apiKey) {
    return respond(500, { error: "missing_openai_key" });
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}") as RequestBody;
  } catch (error) {
    return respond(400, { error: "invalid_json" });
  }

  const prompt = normalisePrompt(payload.prompt);
  if (!prompt) {
    return respond(400, { error: "prompt_required" });
  }

  const size = normaliseSize(payload.size) || 1024;
  const model = normaliseString(payload.model) || DEFAULT_MODEL;
  const quality = normaliseString(payload.quality);
  const style = normaliseString(payload.style);
  const user = normaliseString(payload.user);

  const requestPayload: Record<string, unknown> = {
    model,
    prompt,
    response_format: "b64_json",
    size: `${size}x${size}`,
  };

  if (quality) requestPayload.quality = quality;
  if (style) requestPayload.style = style;
  if (user) requestPayload.user = user;

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const rawText = await response.text();
    let raw: any = null;
    try {
      raw = rawText ? JSON.parse(rawText) : null;
    } catch {
      raw = null;
    }

    if (!response.ok) {
      const details = extractError(raw) || rawText;
      return respond(response.status, { error: "openai_error", details: trimDetails(details) });
    }

    const entries = Array.isArray(raw?.data) ? raw.data : [];
    for (const entry of entries) {
      if (entry && typeof entry === "object") {
        if (typeof entry.b64_json === "string" && entry.b64_json.length > 0) {
          return respond(200, {
            imageUrl: `data:image/png;base64,${entry.b64_json}`,
            provider: "openai",
          });
        }
        if (typeof (entry as any).url === "string" && (entry as any).url.length > 0) {
          return respond(200, { imageUrl: (entry as any).url, provider: "openai" });
        }
      }
    }

    return respond(502, { error: "openai_no_image" });
  } catch (error: any) {
    return respond(500, {
      error: "openai_unexpected",
      details: trimDetails(error?.message || String(error)),
    });
  }
};

function respond(statusCode: number, payload?: Record<string, unknown>) {
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

function normalisePrompt(value: unknown) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed;
}

function normaliseString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normaliseSize(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const clamped = clampSize(Math.round(value));
    return clamped;
  }
  if (typeof value === "string") {
    const numeric = Number.parseInt(value, 10);
    if (Number.isFinite(numeric)) {
      return clampSize(numeric);
    }
  }
  return undefined;
}

function clampSize(value: number) {
  const allowed = [256, 512, 1024, 2048];
  for (const option of allowed) {
    if (value <= option) {
      return option;
    }
  }
  return allowed[allowed.length - 1];
}

function extractError(data: any) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.error === "string") return data.error;
  if (data.error && typeof data.error === "object") {
    if (typeof data.error.message === "string") return data.error.message;
  }
  return "";
}

function trimDetails(details: string) {
  return details ? details.slice(0, 4000) : "";
}
