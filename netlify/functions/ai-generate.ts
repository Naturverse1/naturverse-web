import type { Handler } from "@netlify/functions";

const HF_URL =
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;
const MIN_DIMENSION = 256;
const MAX_DIMENSION = 1536;
const DEFAULT_GUIDANCE = 5.0;
const DEFAULT_STEPS = 28;

export const handler: Handler = async (event) => {
  try {
    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) {
      return jsonError(500, "Missing HF_API_TOKEN");
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(event.body || "{}");
    } catch {
      return jsonError(400, "Invalid JSON payload");
    }

    const rawPrompt = typeof parsed.prompt === "string" ? parsed.prompt.trim() : "";
    if (!rawPrompt) {
      return jsonError(400, "Missing prompt");
    }

    const negativePrompt =
      typeof parsed.negativePrompt === "string" && parsed.negativePrompt.trim()
        ? parsed.negativePrompt.trim()
        : undefined;

    const { width, height } = parseSize(parsed.size);
    const seed = normalizeSeed(parsed.seed);

    const body = {
      inputs: rawPrompt,
      parameters: {
        negative_prompt: negativePrompt,
        width,
        height,
        guidance_scale: DEFAULT_GUIDANCE,
        num_inference_steps: DEFAULT_STEPS,
        ...(typeof seed === "number" ? { seed } : {}),
      },
      options: { wait_for_model: true },
    };

    const resp = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "image/png,application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = resp.headers.get("content-type") || "";
    const raw = await safeRead(resp, contentType);

    if (!resp.ok) {
      return jsonError(resp.status, "Hugging Face error", raw);
    }

    if (contentType.startsWith("image/")) {
      if (!(raw instanceof ArrayBuffer)) {
        return jsonError(502, "Invalid image payload from Hugging Face", raw);
      }

      const buf = Buffer.from(raw);
      return {
        statusCode: 200,
        headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
        body: buf.toString("base64"),
        isBase64Encoded: true,
      };
    }

    return jsonError(502, "Unexpected non-image response", raw);
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as any).message)
        : "Server error";
    return jsonError(500, "Server error", { message });
  }
};

function jsonError(statusCode: number, message: string, extra?: unknown) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ errors: [message], raw: extra ?? null }),
  };
}

async function safeRead(resp: Response, contentType: string): Promise<unknown> {
  if (contentType.startsWith("image/")) {
    return await resp.arrayBuffer();
  }
  if (contentType.includes("json")) {
    return await resp.json().catch(() => ({}));
  }
  return await resp.text().catch(() => "");
}

function parseSize(sizeValue: unknown): { width: number; height: number } {
  if (typeof sizeValue === "string") {
    const [rawW, rawH] = sizeValue.toLowerCase().split("x");
    const parsedW = Number(rawW);
    const parsedH = Number(rawH);
    if (Number.isFinite(parsedW) && Number.isFinite(parsedH)) {
      return {
        width: clampDimension(parsedW),
        height: clampDimension(parsedH),
      };
    }
  }

  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
}

function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_WIDTH;
  const clamped = Math.round(value);
  return Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, clamped));
}

function normalizeSeed(seed: unknown): number | undefined {
  if (typeof seed === "number" && Number.isFinite(seed)) {
    return clampSeed(seed);
  }
  if (typeof seed === "string" && seed.trim()) {
    const parsed = Number(seed);
    if (Number.isFinite(parsed)) {
      return clampSeed(parsed);
    }
  }
  return undefined;
}

function clampSeed(value: number): number {
  const normalized = Math.floor(value);
  const max = 0xffff_ffff;
  if (normalized < 0) return 0;
  if (normalized > max) return max;
  return normalized;
}
