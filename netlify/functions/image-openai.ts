import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

const OPENAI_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-1";
const PROVIDER = "openai" as const;
const TIMEOUT_MS = 20_000;
const RETRYABLE_STATUS = new Set([502, 503, 504]);

type NormalisedSize = "512" | "1024" | "2048";

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
    return respond(200, {});
  }

  if (event.httpMethod !== "POST") {
    return respondError(405, "method_not_allowed");
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BEARER || "";
  if (!apiKey) {
    return respondError(500, "missing_api_key", "OPENAI_API_KEY");
  }

  let payload: RequestBody;
  try {
    payload = JSON.parse(event.body || "{}") as RequestBody;
  } catch {
    return respondError(400, "invalid_json");
  }

  const prompt = normalisePrompt(payload.prompt);
  if (!prompt) {
    return respondError(400, "prompt_required");
  }

  const size = normaliseSize(payload.size) ?? "1024";
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
    const response = await withRetry(() =>
      fetchWithTimeout(OPENAI_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
      })
    );

    const text = await response.text();
    const data = text ? safeJson(text) : null;

    if (!response.ok) {
      const upstream = getUpstreamMessage(data) || text;
      return respondError(
        response.status,
        mapUpstreamError(response.status, upstream),
        upstream || response.status,
      );
    }

    const entries = Array.isArray((data as any)?.data) ? (data as any).data : [];
    for (const entry of entries) {
      if (entry && typeof entry === "object") {
        if (typeof entry.b64_json === "string" && entry.b64_json.length > 0) {
          return respond(200, { imageUrl: `data:image/png;base64,${entry.b64_json}` });
        }
        if (typeof (entry as any).url === "string" && (entry as any).url.length > 0) {
          return respond(200, { imageUrl: (entry as any).url });
        }
      }
    }

    return respondError(502, "no_image");
  } catch (error: any) {
    if (isAbortError(error)) {
      return respondError(504, "timeout");
    }
    return respondError(502, "network_error", error?.message);
  }
};

function respond(statusCode: number, payload: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ provider: PROVIDER, ...payload }),
  };
}

function respondError(statusCode: number, error: string, code?: unknown) {
  const body: Record<string, unknown> = { provider: PROVIDER, error };
  if (typeof code === "string" || typeof code === "number") {
    body.code = code;
  }
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function normalisePrompt(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normaliseString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normaliseSize(value: unknown): NormalisedSize | undefined {
  const allowed: NormalisedSize[] = ["512", "1024", "2048"];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if ((allowed as readonly string[]).includes(trimmed)) {
      return trimmed as NormalisedSize;
    }
    const numeric = Number.parseInt(trimmed, 10);
    if (Number.isFinite(numeric)) {
      return clampSize(numeric);
    }
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampSize(Math.round(value));
  }
  return undefined;
}

function clampSize(value: number): NormalisedSize {
  if (value <= 512) return "512";
  if (value <= 1024) return "1024";
  return "2048";
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getUpstreamMessage(data: any) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.error === "string") return data.error;
  if (data.error && typeof data.error === "object") {
    if (typeof data.error.message === "string") return data.error.message;
    if (typeof data.error.code === "string" || typeof data.error.code === "number") {
      return String(data.error.code);
    }
  }
  return "";
}

function mapUpstreamError(status: number, message: string) {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  if (status === 400) return "invalid_request";
  if (status >= 500) return "upstream_error";
  if (message?.toLowerCase().includes("content policy")) return "content_policy";
  return "upstream_error";
}

async function withRetry(request: () => Promise<Response>) {
  const first = await request();
  if (!RETRYABLE_STATUS.has(first.status)) {
    return first;
  }
  const second = await request();
  return second;
}

async function fetchWithTimeout(input: RequestInfo, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
