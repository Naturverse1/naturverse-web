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

function normalizeDimension(value: number | undefined): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.max(256, Math.min(2048, Math.floor(value)));
}

function stringifyErrorPayload(payload: unknown): string {
  if (!payload) return "Unknown error from Hugging Face";
  if (typeof payload === "string") return payload;
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const detail = record.detail ?? record.error ?? record.message;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
    try {
      return JSON.stringify(payload);
    } catch {
      return String(payload);
    }
  }
  return String(payload);
}

export interface GenerateNavatarOptions {
  prompt: string;
  avoid?: string;
  seed?: number;
  width?: number;
  height?: number;
  onBrand?: boolean;
  signal?: AbortSignal;
}

export async function generateNavatarImage({
  prompt,
  avoid,
  seed,
  width,
  height,
  onBrand = true,
  signal,
}: GenerateNavatarOptions): Promise<Blob> {
  const trimmedPrompt = prompt?.trim();
  if (!trimmedPrompt) {
    throw new Error("Prompt required");
  }

  const payload: Record<string, unknown> = {
    prompt: trimmedPrompt,
    onBrand,
  };

  const normalizedWidth = normalizeDimension(width) ?? 1024;
  const normalizedHeight = normalizeDimension(height) ?? 1024;
  payload.width = normalizedWidth;
  payload.height = normalizedHeight;

  const trimmedAvoid = avoid?.trim();
  if (trimmedAvoid) {
    payload.avoid = trimmedAvoid;
  }

  const normalizedSeed = normalizeSeed(seed);
  if (typeof normalizedSeed === "number") {
    payload.seed = normalizedSeed;
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
    throw new Error("Unable to reach the AI generator. Check your connection and try again.");
  }

  const ct = resp.headers.get("content-type") || "";

  if (!resp.ok) {
    const raw = await resp.text();
    let parsed: unknown = raw;
    if (ct.includes("json")) {
      try {
        parsed = JSON.parse(raw || "null");
      } catch {
        parsed = raw;
      }
    }
    throw new Error(stringifyErrorPayload(parsed));
  }

  if (ct.includes("image/")) {
    return await resp.blob();
  }

  const raw = await resp.text();
  let parsed: unknown = raw;
  if (ct.includes("json")) {
    try {
      parsed = JSON.parse(raw || "null");
    } catch {
      parsed = raw;
    }
  }
  throw new Error(stringifyErrorPayload(parsed));
}
