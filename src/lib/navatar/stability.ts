export type StylePreset = {
  id: string;
  label: string;
  stylePreset: string;
  description: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "navatar-classic",
    label: "Navatar Classic",
    stylePreset: "comic-book",
    description: "Bold outlines, bright palette, classic Naturverse vibe.",
  },
  {
    id: "storybook-soft",
    label: "Storybook Soft",
    stylePreset: "digital-art",
    description: "Soft gradients and cozy light with painterly charm.",
  },
  {
    id: "sticker-pop",
    label: "Sticker Pop",
    stylePreset: "fantasy-art",
    description: "High-contrast colors and extra punchy highlights.",
  },
];

export const DEFAULT_STYLE_ID = STYLE_PRESETS[0]?.id ?? "navatar-classic";

export const DEFAULT_NEGATIVE_PROMPT =
  "photo, photorealistic, hyperrealistic, text, caption, letters, logo, watermark, signature, grain, noise, artifacts, extra limbs, deformed hands";

export const MAX_SEED = 0xffff_ffff; // 4294967295

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

export function buildPrompt(userPrompt: string): string {
  return userPrompt.trim();
}

export function buildNegativePrompt(extra?: string): string {
  return extra?.trim() ?? "";
}

const seedFromString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  const normalized = (hash >>> 0) % MAX_SEED;
  return normalized === 0 ? 1 : normalized;
};

export function seedFromUserId(userId?: string): number {
  const source = userId?.trim() || "naturverse";
  return seedFromString(source);
}

export function normalizeSeed(seed: number | undefined): number | undefined {
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

export interface StabilityGenerateOptions {
  prompt: string;
  avoid?: string;
  seed?: number;
  keepSeed?: boolean;
  onBrand?: boolean;
  stylePreset?: string;
  signal?: AbortSignal;
}

export interface StabilityGenerateResult {
  blob: Blob;
  remaining?: number | null;
}

function messageFromErrorPayload(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === "string") {
    return payload.trim() || null;
  }
  if (typeof payload === "object") {
    const detail =
      "detail" in payload && typeof (payload as any).detail === "string"
        ? (payload as any).detail
        : null;
    if (detail?.trim()) {
      return detail.trim();
    }
    const error =
      "error" in payload && typeof (payload as any).error === "string"
        ? (payload as any).error
        : null;
    if (error?.trim()) {
      return error.trim();
    }
  }
  return null;
}

export async function generateWithStability({
  prompt,
  avoid,
  seed,
  keepSeed,
  onBrand,
  stylePreset,
  signal,
}: StabilityGenerateOptions): Promise<StabilityGenerateResult> {
  if (!prompt?.trim()) {
    throw new StabilityError("Prompt required");
  }

  const normalizedSeed = normalizeSeed(seed);
  const shouldKeepSeed = Boolean(keepSeed && typeof normalizedSeed === "number");

  const payload: Record<string, unknown> = {
    prompt: prompt.trim(),
    avoid: avoid?.trim() || undefined,
    stylePreset,
    onBrand,
  };

  if (shouldKeepSeed && typeof normalizedSeed === "number") {
    payload.seed = normalizedSeed;
    payload.keepSeed = true;
  }

  let resp: Response;
  try {
    resp = await fetch("/.netlify/functions/stability-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new StabilityError("Unable to reach Stability right now. Check your connection and try again.");
  }

  const remaining = parseRemaining(resp.headers.get("x-ratelimit-remaining"));
  const contentType = resp.headers.get("content-type") || "";

  if (!resp.ok) {
    let payload: unknown = null;
    if (contentType.includes("application/json")) {
      payload = await resp.json().catch(() => null);
    } else {
      const text = await resp.text().catch(() => "");
      payload = text ? { error: text } : null;
    }
    const detail = messageFromErrorPayload(payload);

    if (resp.status === 429 || (typeof remaining === "number" && remaining <= 0)) {
      throw new RateLimitError(RATE_LIMIT_MESSAGE, remaining);
    }

    throw new StabilityError(detail || `HTTP ${resp.status}`, resp.status, remaining);
  }

  if (contentType.startsWith("image/")) {
    const blob = await resp.blob();
    return { blob, remaining };
  }

  let fallbackPayload: unknown = null;
  if (contentType.includes("application/json")) {
    fallbackPayload = await resp.json().catch(() => null);
  } else {
    const text = await resp.text().catch(() => "");
    fallbackPayload = text ? { error: text } : null;
  }

  const message = messageFromErrorPayload(fallbackPayload) || "Unexpected response from Stability";
  throw new StabilityError(message, resp.status || 500, remaining);
}
