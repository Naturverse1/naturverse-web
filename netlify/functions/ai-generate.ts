import type { Handler } from "@netlify/functions";

const HF_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const STABILITY_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";
const GUIDANCE_SCALE = 3.5;
const DEFAULT_SIZE = { width: 1024, height: 1024 };
const MAX_DIMENSION = 2048;
const MIN_DIMENSION = 128;
const MAX_SEED = 0xffff_ffff;

type GeneratePayload = {
  prompt?: unknown;
  negativePrompt?: unknown;
  seed?: unknown;
  size?: unknown;
  style?: unknown;
  onBrand?: unknown;
};

type ImageResult = {
  buffer: Buffer;
  headers?: Record<string, string>;
  statusCode?: number;
  error?: string;
};

function jsonResponse(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  };
}

function imageResponse(result: ImageResult) {
  const { buffer, headers } = result;
  return {
    statusCode: 200,
    body: buffer.toString("base64"),
    isBase64Encoded: true,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
      ...(headers ?? {}),
    },
  };
}

function clampDimension(value: number): number {
  const limited = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, Math.floor(value)));
  return Number.isFinite(limited) ? limited : DEFAULT_SIZE.width;
}

function parseSize(raw: unknown): { width: number; height: number } {
  if (typeof raw !== "string") {
    return DEFAULT_SIZE;
  }

  const pieces = raw.toLowerCase().split("x");
  if (pieces.length !== 2) {
    return DEFAULT_SIZE;
  }

  const parsedWidth = Number(pieces[0]);
  const parsedHeight = Number(pieces[1]);

  if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedHeight)) {
    return DEFAULT_SIZE;
  }

  return {
    width: clampDimension(parsedWidth),
    height: clampDimension(parsedHeight),
  };
}

function normalizeSeed(raw: unknown): number | undefined {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return undefined;
  }
  if (raw <= 0) return 0;
  if (raw >= MAX_SEED) return MAX_SEED;
  return Math.floor(raw);
}

async function tryHuggingFace(
  token: string,
  {
    prompt,
    negativePrompt,
    seed,
    width,
    height,
  }: {
    prompt: string;
    negativePrompt?: string;
    seed?: number;
    width: number;
    height: number;
  }
): Promise<ImageResult | null> {
  const parameters: Record<string, unknown> = {
    guidance_scale: GUIDANCE_SCALE,
    width,
    height,
  };

  if (negativePrompt) {
    parameters.negative_prompt = negativePrompt;
  }

  if (typeof seed === "number") {
    parameters.seed = seed;
  }

  try {
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "image/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters,
        options: { wait_for_model: true },
      }),
    });

    if (!response.ok) {
      const detail = await extractErrorDetail(response);
      return {
        buffer: Buffer.alloc(0),
        error: detail,
        statusCode: response.status,
        headers: { "x-ai-provider": "huggingface" },
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      buffer,
      headers: { "x-ai-provider": "huggingface" },
    };
  } catch (error: any) {
    return {
      buffer: Buffer.alloc(0),
      error: error?.message ?? "huggingface_fetch_failed",
      statusCode: 502,
      headers: { "x-ai-provider": "huggingface" },
    };
  }
}

async function tryStability(
  apiKey: string,
  {
    prompt,
    negativePrompt,
    seed,
    width,
    height,
    style,
  }: {
    prompt: string;
    negativePrompt?: string;
    seed?: number;
    width: number;
    height: number;
    style?: string;
  }
): Promise<ImageResult> {
  const payload: Record<string, unknown> = {
    prompt,
    output_format: "png",
    width,
    height,
  };

  if (negativePrompt) {
    payload.negative_prompt = negativePrompt;
  }

  if (typeof seed === "number") {
    payload.seed = seed;
  }

  if (style) {
    payload.style_preset = style;
  }

  const response = await fetch(STABILITY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "image/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      buffer: Buffer.alloc(0),
      error: detail || "stability_error",
      statusCode: response.status,
      headers: { "x-ai-provider": "stability" },
    };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const headers: Record<string, string> = { "x-ai-provider": "stability" };
  const remaining = response.headers.get("x-ratelimit-remaining");
  if (remaining) {
    headers["x-ratelimit-remaining"] = remaining;
  }

  return {
    buffer,
    headers,
  };
}

async function extractErrorDetail(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const data = await response.json();
      if (data && typeof data === "object" && "error" in data) {
        const errValue = (data as Record<string, unknown>).error;
        if (typeof errValue === "string") {
          return errValue;
        }
      }
      return JSON.stringify(data);
    } catch {
      // fall through
    }
  }

  try {
    const text = await response.text();
    if (text) {
      return text;
    }
  } catch {
    // ignore
  }

  return `HTTP ${response.status}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const hfToken = process.env.HF_TOKEN?.trim();
  const stabilityKey = process.env.STABILITY_API_KEY?.trim();

  let payload: GeneratePayload;
  try {
    payload = JSON.parse(event.body ?? "{}") as GeneratePayload;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload" });
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    return jsonResponse(400, { error: "Missing prompt" });
  }

  const negativePrompt =
    typeof payload.negativePrompt === "string" && payload.negativePrompt.trim()
      ? payload.negativePrompt.trim()
      : undefined;

  const { width, height } = parseSize(payload.size);
  const seed = normalizeSeed(payload.seed);
  const style = typeof payload.style === "string" && payload.style.trim() ? payload.style.trim() : undefined;

  if (!hfToken && !stabilityKey) {
    return jsonResponse(400, { error: "No AI provider configured" });
  }

  if (hfToken) {
    const hfResult = await tryHuggingFace(hfToken, { prompt, negativePrompt, seed, width, height });
    if (hfResult && !hfResult.error) {
      return imageResponse(hfResult);
    }

    // If Hugging Face failed but Stability is available, fall through to Stability.
    if (!stabilityKey) {
      const statusCode = hfResult?.statusCode ?? 502;
      return jsonResponse(statusCode, {
        error: "huggingface_error",
        detail: hfResult?.error ?? "Unknown Hugging Face error",
      });
    }
  }

  if (stabilityKey) {
    try {
      const stabilityResult = await tryStability(stabilityKey, {
        prompt,
        negativePrompt,
        seed,
        width,
        height,
        style,
      });
      if (!stabilityResult.error) {
        return imageResponse(stabilityResult);
      }
      return jsonResponse(stabilityResult.statusCode ?? 502, {
        error: "stability_error",
        detail: stabilityResult.error,
      });
    } catch (error: any) {
      return jsonResponse(502, {
        error: "stability_error",
        detail: error?.message ?? "Unknown Stability error",
      });
    }
  }

  return jsonResponse(500, { error: "ai_generation_failed" });
};
