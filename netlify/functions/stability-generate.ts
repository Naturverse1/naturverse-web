import type { Handler } from "@netlify/functions";

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

export const config = {
  maxDuration: 26,
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...JSON_HEADERS,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return json(500, { error: "missing_stability_key" });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || "{}") as Record<string, unknown>;
  } catch (error: any) {
    return json(400, { error: "invalid_json", detail: error?.message ?? String(error) });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return json(400, { error: "prompt_required" });
  }

  const negativePrompt = typeof body.negativePrompt === "string" ? body.negativePrompt.trim() : undefined;
  const stylePreset = typeof body.style === "string" ? body.style.trim() : undefined;
  const size = typeof body.size === "string" ? body.size.trim().toLowerCase() : undefined;
  const seed = normalizeSeed(body.seed);
  const { width, height } = size ? parseSize(size) : { width: 1024, height: 1024 };

  const requestPayload: Record<string, unknown> = {
    prompt,
    output_format: "png",
    width,
    height,
  };

  if (negativePrompt) requestPayload.negative_prompt = negativePrompt;
  if (typeof seed === "number") requestPayload.seed = seed;
  if (stylePreset) requestPayload.style_preset = stylePreset;

  try {
    const resp = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    const remaining = resp.headers.get("x-ratelimit-remaining") ?? undefined;

    if (!resp.ok) {
      const detail = await safeReadText(resp);
      return json(resp.status, { error: "stability_error", detail }, remaining);
    }

    const data = await resp.json().catch(() => null);
    const artifact = data?.artifacts?.[0];
    const b64 = typeof artifact?.base64 === "string" && artifact.base64
      ? artifact.base64
      : typeof artifact?.b64_json === "string" && artifact.b64_json
      ? artifact.b64_json
      : null;
    const mime = typeof artifact?.mime === "string" && artifact.mime ? artifact.mime : "image/png";
    const url = typeof artifact?.url === "string" ? artifact.url : null;

    if (b64) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": mime,
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
        body: b64,
        isBase64Encoded: true,
      };
    }

    if (url) {
      return json(200, { url }, remaining);
    }

    return json(502, { error: "invalid_stability_response" }, remaining);
  } catch (error: any) {
    return json(500, { error: "proxy_failure", detail: error?.message ?? String(error) });
  }
};

function json(statusCode: number, payload: unknown, remaining?: string) {
  return {
    statusCode,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
    },
    body: JSON.stringify(payload),
  };
}

function safeReadText(response: Response): Promise<string> {
  return response.text().catch(() => "");
}

function normalizeSeed(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const normalized = Math.floor(value);
  if (normalized < 0) return 0;
  const max = 0xffff_ffff;
  return normalized > max ? max : normalized;
}

function parseSize(value: string): { width: number; height: number } {
  const match = value.match(/^(\d{2,4})x(\d{2,4})$/);
  if (match) {
    const width = clamp(Number(match[1]), 128, 2048);
    const height = clamp(Number(match[2]), 128, 2048);
    return { width, height };
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    const clamped = clamp(Math.floor(numeric), 128, 2048);
    return { width: clamped, height: clamped };
  }

  return { width: 1024, height: 1024 };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
