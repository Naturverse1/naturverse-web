const STABILITY_ENDPOINT = "/.netlify/functions/stability-generate";

const BASE_NEGATIVE =
  "photo, photorealistic, hyperrealistic, text, caption, letters, logo, watermark, signature, grain, noise, artifacts";

export const MAX_SEED = 0xffff_ffff; // 4294967295

export type GenerateOptions = {
  prompt: string;
  avoid?: string;
  seed?: number;
  keepSeed?: boolean;
  stylePreset?: string;
  signal?: AbortSignal;
};

export type GenerateResult = {
  blob: Blob;
  remaining?: number | null;
};

export class StabilityError extends Error {
  status?: number;
  remaining?: number | null;

  constructor(message: string, status?: number, remaining?: number | null) {
    super(message);
    this.name = "StabilityError";
    this.status = status;
    this.remaining = remaining ?? null;
  }
}

export class RateLimitError extends StabilityError {
  constructor(message: string, remaining?: number | null) {
    super(message, 429, remaining ?? null);
    this.name = "RateLimitError";
  }
}

export const RATE_LIMIT_MESSAGE = "You’ve reached today’s free 25 Stability generations.";

function normalizeSeed(seed: number | undefined): number | undefined {
  if (typeof seed !== "number" || !Number.isFinite(seed)) return undefined;
  if (seed < 0) return 0;
  if (seed > MAX_SEED) return MAX_SEED;
  return Math.floor(seed);
}

function parseRemaining(header: string | null): number | null {
  if (!header) return null;
  const value = Number(header);
  return Number.isFinite(value) ? value : null;
}

export async function generateWithStability({
  prompt,
  avoid = "",
  seed,
  keepSeed = true,
  stylePreset = "comic-book",
  signal,
}: GenerateOptions): Promise<GenerateResult> {
  const trimmedPrompt = prompt?.trim();
  if (!trimmedPrompt) {
    throw new StabilityError("Prompt required");
  }

  const normalizedAvoid = avoid.trim();
  const negativePrompt = [BASE_NEGATIVE, normalizedAvoid].filter(Boolean).join(", ");

  const payload: Record<string, unknown> = {
    prompt: trimmedPrompt,
    negativePrompt,
    stylePreset,
    style_preset: stylePreset,
    output_format: "png",
    aspect_ratio: "1:1",
  };

  const normalizedSeed = normalizeSeed(seed);
  if (keepSeed && typeof normalizedSeed === "number") {
    payload.seed = normalizedSeed;
  }

  let resp: Response;
  try {
    resp = await fetch(STABILITY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (error) {
    throw new StabilityError("Unable to reach Stability right now. Check your connection and try again.");
  }

  const remaining = parseRemaining(resp.headers.get("x-ratelimit-remaining"));

  if (!resp.ok) {
    if (resp.status === 429 || (typeof remaining === "number" && remaining <= 0)) {
      throw new RateLimitError(RATE_LIMIT_MESSAGE, remaining);
    }

    const contentType = resp.headers.get("content-type") ?? "";
    let message: string | undefined;

    if (contentType.includes("application/json")) {
      const data = await resp.json().catch(() => null);
      if (data && typeof data === "object") {
        if ("detail" in data && data.detail) {
          message = String((data as any).detail);
        } else if ("error" in data && data.error) {
          message = String((data as any).error);
        }
      }
    }

    if (!message) {
      message = await resp.text().catch(() => undefined);
    }

    throw new StabilityError(message || `HTTP ${resp.status}`, resp.status, remaining);
  }

  const blob = await resp.blob();
  return { blob, remaining };
}
