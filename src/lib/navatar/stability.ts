export type StylePreset = {
  id: string;
  label: string;
  prompt: string;
  description: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "cute-creature",
    label: "Cute Creature",
    prompt:
      "adorable creature design, plush textures, rounded silhouettes, cozy lighting, soft gradients",
    description: "Soft, plushy friend with big eyes and cozy colors.",
  },
  {
    id: "mythical-friend",
    label: "Mythical Friend",
    prompt:
      "mythical companion, gentle glow, fantasy illustration, ornate patterns, flowing shapes",
    description: "Sparkling fantasy companion with storybook magic.",
  },
  {
    id: "jungle-buddy",
    label: "Jungle Buddy",
    prompt:
      "lush rainforest setting, tropical foliage, playful energy, vibrant greens and oranges, painterly strokes",
    description: "Playful jungle explorer surrounded by tropical vibes.",
  },
  {
    id: "ocean-guardian",
    label: "Ocean Guardian",
    prompt:
      "underwater fantasy, coral-inspired shapes, shimmering light rays, teal and coral palette, smooth gradients",
    description: "Glowing underwater hero with gentle waves.",
  },
  {
    id: "forest-sprite",
    label: "Forest Sprite",
    prompt:
      "mossy textures, dappled forest light, tiny guardian spirit, whimsical nature illustration, watercolor softness",
    description: "Tiny woodland spirit with glowing leaves.",
  },
  {
    id: "sky-traveler",
    label: "Sky Traveler",
    prompt:
      "floating in clouds, warm sunlight, dynamic motion, airy composition, pastel blues and golds",
    description: "Adventurer soaring through pastel skies.",
  },
  {
    id: "crystal-beast",
    label: "Crystal Beast",
    prompt:
      "faceted crystal forms, iridescent reflections, luminous core, high-contrast fantasy art, prismatic colors",
    description: "Shimmering creature built from magical crystals.",
  },
  {
    id: "robot-pal",
    label: "Robot Pal",
    prompt:
      "friendly robot companion, smooth chrome panels, soft neon accents, rounded shapes, Pixar-like lighting",
    description: "Helpful robo-buddy with glowing gadgets.",
  },
];

export const DEFAULT_STYLE_ID = STYLE_PRESETS[0]?.id ?? "cute-creature";

const GUARDED_PHRASE =
  "family-friendly, wholesome, cheerful expression, bright color palette, soft lighting, clean background, no text, no watermark, no signatures, kid-safe";

export const DEFAULT_NEGATIVE_PROMPT =
  "realistic gore, violence, guns, logos, words, letters, watermark";

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

export function buildPrompt(userPrompt: string, style: StylePreset): string {
  const trimmed = userPrompt.trim();
  const parts = [
    trimmed,
    `Style: ${style.label} — ${style.prompt}`,
    GUARDED_PHRASE,
  ].filter(Boolean);
  return parts.join("; ");
}

export function buildNegativePrompt(extra?: string): string {
  const additions = extra?.trim();
  if (!additions) return DEFAULT_NEGATIVE_PROMPT;
  return `${DEFAULT_NEGATIVE_PROMPT}, ${additions}`;
}

export function seedFromUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  const normalized = (hash >>> 0) % MAX_SEED;
  return normalized === 0 ? 1 : normalized;
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

export interface GenerateWithAIOptions {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  size?: string;
  style?: string;
  signal?: AbortSignal;
  onBrand?: boolean;
}

export interface GenerateWithAIResult {
  blob: Blob;
  remaining?: number | null;
  provider?: string | null;
}

export async function generateWithAI({
  prompt,
  negativePrompt,
  seed,
  size,
  style,
  signal,
  onBrand,
}: GenerateWithAIOptions): Promise<GenerateWithAIResult> {
  if (!prompt?.trim()) {
    throw new StabilityError("Prompt required");
  }

  const payload: Record<string, unknown> = {
    prompt,
    negativePrompt: negativePrompt?.trim() || undefined,
    size: size?.trim() || undefined,
    style: style?.trim() || undefined,
  };

  const normalizedSeed = normalizeSeed(seed);
  if (typeof normalizedSeed === "number") {
    payload.seed = normalizedSeed;
  }

  if (typeof onBrand === "boolean") {
    payload.onBrand = onBrand;
  }

  let resp: Response;
  try {
    resp = await fetch("/.netlify/functions/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new StabilityError(
      "Unable to reach the Navatar generator right now. Check your connection and try again."
    );
  }

  const remaining = parseRemaining(resp.headers.get("x-ratelimit-remaining"));
  const provider = resp.headers.get("x-ai-provider");

  if (!resp.ok) {
    let detail: string | null = null;
    const contentType = resp.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const err = await resp.json().catch(() => null);
      if (err && typeof err === "object") {
        if ("detail" in err && typeof (err as any).detail === "string") {
          detail = (err as any).detail;
        } else if ("error" in err && typeof (err as any).error === "string") {
          detail = (err as any).error;
        }
      }
    }

    if (!detail) {
      detail = await resp.text().catch(() => null);
    }

    if (resp.status === 429 || (typeof remaining === "number" && remaining <= 0)) {
      throw new RateLimitError(RATE_LIMIT_MESSAGE, remaining);
    }

    throw new StabilityError(detail || `HTTP ${resp.status}`, resp.status, remaining);
  }

  const blob = await resp.blob();
  return { blob, remaining, provider: provider ?? null };
}
