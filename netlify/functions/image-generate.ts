import type { Handler } from "@netlify/functions";

// Netlify (Node 20) has global fetch/Headers/FormData via undici.

const OPENAI_IMAGE_URL = "https://api.openai.com/v1/images/generations";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
} as const;

type ImagePayload = {
  prompt?: string;
  model?: string;
  size?: string;
  quality?: string;
  style?: string;
  background?: string;
  n?: number;
  user?: string;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { ...CORS_HEADERS } };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BEARER;
  if (!apiKey) {
    return json(500, { error: "missing_openai_key" });
  }

  let payload: ImagePayload;
  try {
    payload = JSON.parse(event.body || "{}") as ImagePayload;
  } catch (error) {
    return json(400, { error: "invalid_json" });
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    return json(400, { error: "prompt_required" });
  }

  const model = normaliseString(payload.model) || "gpt-image-1";
  const size = normaliseString(payload.size);
  const quality = normaliseString(payload.quality);
  const style = normaliseString(payload.style);
  const background = normaliseString(payload.background);
  const user = normaliseString(payload.user);
  const n = normaliseCount(payload.n);

  const requestBody: Record<string, unknown> = {
    model,
    prompt,
    response_format: "b64_json",
  };

  if (size) requestBody.size = size;
  if (quality) requestBody.quality = quality;
  if (style) requestBody.style = style;
  if (background) requestBody.background = background;
  if (user) requestBody.user = user;
  if (n) requestBody.n = n;

  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await fetch(OPENAI_IMAGE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return json(response.status, { error: "openai_error", detail: detail.slice(0, 10_000) });
    }

    const data = await response.json().catch(() => null);
    if (!data || !Array.isArray(data?.data)) {
      return json(502, { error: "invalid_openai_response" });
    }

    const images = data.data
      .map((entry: any) => extractImage(entry))
      .filter((url: string | null): url is string => typeof url === "string" && url.length > 0);

    if (images.length === 0) {
      return json(502, { error: "no_images_returned" });
    }

    return json(200, { images });
  } catch (error: any) {
    return json(500, { error: "unexpected_error", detail: error?.message || String(error) });
  }
};

function json(statusCode: number, payload: unknown) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

function normaliseString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normaliseCount(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const clamped = Math.min(Math.max(Math.floor(value), 1), 4);
  return clamped;
}

function extractImage(entry: any): string | null {
  if (!entry || typeof entry !== "object") return null;
  if (typeof entry.b64_json === "string" && entry.b64_json) {
    return `data:image/png;base64,${entry.b64_json}`;
  }
  if (typeof entry.url === "string" && entry.url) {
    return entry.url;
  }
  return null;
}
