import type { Handler } from "@netlify/functions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
} as const;

const STABILITY_URL =
  "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

const PROVIDER = "stability" as const;
const TIMEOUT_MS = 20_000;
const RETRYABLE_STATUS = new Set([502, 503, 504]);

type NormalisedSize = "512" | "1024" | "2048";

interface RequestBody {
  prompt?: unknown;
  size?: unknown;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(200, {});
  }

  if (event.httpMethod !== "POST") {
    return respondError(405, "method_not_allowed");
  }

  const apiKey =
    process.env.STABILITY_API_KEY ||
    process.env.STABILITY_API_KEY_BEARER ||
    process.env.VITE_STABILITY_API_KEY ||
    "";

  if (!apiKey) {
    return respondError(500, "missing_api_key", "STABILITY_API_KEY");
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
  const dimension = Number.parseInt(size, 10);

  try {
    const response = await withRetry(() =>
      fetchWithTimeout(STABILITY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          width: dimension,
          height: dimension,
          cfg_scale: 7,
          samples: 1,
        }),
      })
    );

    const text = await response.text();
    const data = text ? safeJson(text) : null;

    if (!response.ok) {
      const message = typeof (data as any)?.message === "string" ? (data as any).message : text;
      return respondError(
        response.status,
        mapUpstreamError(response.status),
        message || response.status,
      );
    }

    const artifacts = Array.isArray((data as any)?.artifacts) ? (data as any).artifacts : [];
    for (const artifact of artifacts) {
      if (artifact && typeof artifact === "object" && typeof artifact.base64 === "string") {
        return respond(200, {
          imageUrl: `data:image/png;base64,${artifact.base64}`,
        });
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

function mapUpstreamError(status: number) {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  if (status === 400) return "invalid_request";
  if (status >= 500) return "upstream_error";
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
