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
  "photo, photorealistic, hyperrealistic, realistic skin, words, text, letters, caption, logo, watermark, gore, violence";

export function buildPrompt(userPrompt: string, style: StylePreset): string {
  const trimmed = userPrompt.trim();
  const parts = [
    trimmed,
    style ? `Style: ${style.label} — ${style.prompt}` : "",
    GUARDED_PHRASE,
  ].filter(Boolean);
  return parts.join("; ");
}

export function seedFromUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  const normalized = (hash >>> 0) % 0xffff_ffff;
  return normalized === 0 ? 1 : normalized;
}
