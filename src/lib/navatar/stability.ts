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

export interface StabilityGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  size?: string;
  style?: string;
  signal?: AbortSignal;
}

export interface StabilityGenerateResult {
  blob: Blob;
  remaining?: number | null;
  source: 'stability' | 'dicebear';
}

export async function generateWithStability({
  prompt,
  negativePrompt,
  seed,
  size,
  style,
  signal,
}: StabilityGenerateOptions): Promise<StabilityGenerateResult> {
  if (!prompt?.trim()) {
    throw new StabilityError("Prompt required");
  }

  const payload: Record<string, unknown> = {
    prompt,
    negativePrompt: negativePrompt?.trim() || undefined,
    size,
    style,
  };

  const normalizedSeed = normalizeSeed(seed);
  if (typeof normalizedSeed === "number") {
    payload.seed = normalizedSeed;
  }

  let resp: Response;
  try {
    resp = await fetch("/.netlify/functions/generate-avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    throw new StabilityError("Unable to reach the avatar generator right now. Check your connection and try again.");
  }

  const data = await resp.json().catch(() => null);

  if (!resp.ok || !data) {
    const detail = typeof data === "object" && data && "error" in data ? String((data as any).error) : null;
    if (resp.status === 429 || resp.status === 402) {
      throw new RateLimitError(RATE_LIMIT_MESSAGE, null);
    }
    throw new StabilityError(detail || `HTTP ${resp.status}`, resp.status);
  }

  const { imageBase64, mime, source, remaining } = data as {
    imageBase64?: string;
    mime?: string;
    source?: string;
    remaining?: number | null;
  };

  if (!imageBase64 || !mime) {
    throw new StabilityError("Invalid image response from generator");
  }

  const blob = base64ToBlob(imageBase64, mime);
  return {
    blob,
    remaining: typeof remaining === "number" ? remaining : undefined,
    source: source === "dicebear" ? "dicebear" : "stability",
  };
}

function base64ToBlob(base64: string, mime: string) {
  const binary = atob(base64);
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}
