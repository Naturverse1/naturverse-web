import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import { useAuthUser } from "../../lib/useAuthUser";
import { generateNavatar } from "../../lib/navatar/generate";
import "../../styles/navatar.css";

type StylePreset = {
  id: string;
  label: string;
  prompt: string;
  description: string;
};

const STYLE_PRESETS: StylePreset[] = [
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

const DEFAULT_STYLE_ID = STYLE_PRESETS[0]?.id ?? "cute-creature";

const GUARDED_PHRASE =
  "family-friendly, wholesome, cheerful expression, bright color palette, soft lighting, clean background, no text, no watermark, no signatures, kid-safe";

const DEFAULT_NEGATIVE_PROMPT =
  "realistic gore, violence, guns, logos, words, letters, watermark";

const BRAND_NEGATIVE = [
  "photo, photorealistic, hyperrealistic,",
  "text, caption, letters, logo, watermark, signature,",
  "grain, noise, artifacts, extra limbs, deformed hands",
].join(", ");

const MAX_SEED = 1_000_000;

function randomSeed(): number {
  return Math.floor(Math.random() * MAX_SEED) || 1;
}

function seedFromUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash) % MAX_SEED;
  return normalized === 0 ? 1 : normalized;
}

function buildPrompt(userPrompt: string, style: StylePreset): string {
  const trimmed = userPrompt.trim();
  const parts = [
    trimmed,
    `Style: ${style.label} — ${style.prompt}`,
    GUARDED_PHRASE,
  ].filter(Boolean);
  return parts.join("; ");
}

function buildNegativePrompt(extra?: string): string {
  const additions = extra?.trim();
  if (!additions) return DEFAULT_NEGATIVE_PROMPT;
  return `${DEFAULT_NEGATIVE_PROMPT}, ${additions}`;
}

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState(DEFAULT_STYLE_ID);
  const [extraNegativePrompt, setExtraNegativePrompt] = useState("");
  const [seedLocked, setSeedLocked] = useState(false);
  const [seed, setSeed] = useState<number | undefined>();
  const [onBrand, setOnBrand] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    if (!file) {
      setDraftUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setDraftUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (user?.id) {
      setSeedLocked((prev) => (prev ? prev : true));
      setSeed((prev) => (typeof prev === "number" ? prev : seedFromUserId(user.id)));
    } else {
      setSeedLocked(false);
      setSeed(undefined);
    }
  }, [user?.id]);

  const selectedStyle = useMemo(
    () => STYLE_PRESETS.find((preset) => preset.id === styleId) ?? STYLE_PRESETS[0],
    [styleId]
  );

  const alwaysFilteredPrompt = useMemo(
    () => (onBrand ? `${DEFAULT_NEGATIVE_PROMPT}, ${BRAND_NEGATIVE}` : DEFAULT_NEGATIVE_PROMPT),
    [onBrand]
  );

  const handleSeedToggle = (checked: boolean) => {
    setSeedLocked(checked);
    if (checked && typeof seed !== "number") {
      if (user?.id) {
        setSeed(seedFromUserId(user.id));
      } else {
        setSeed(randomSeed());
      }
    }
  };

  const handleRandomizeSeed = () => {
    if (!seedLocked) return;
    setSeed(randomSeed());
  };

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast({ text: "Add or generate an image first", kind: "err" });
      return;
    }
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      nav("/navatar");
    } catch {
      toast({ text: "Save failed", kind: "err" });
    }
  }

  async function handleGenerate() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    const finalPrompt = buildPrompt(trimmedPrompt, selectedStyle);
    const baseNegativePrompt = buildNegativePrompt(extraNegativePrompt);

    let generationSeed: number | undefined;
    if (seedLocked) {
      if (typeof seed === "number") {
        generationSeed = seed;
      } else if (user?.id) {
        const lockedSeed = seedFromUserId(user.id);
        generationSeed = lockedSeed;
        setSeed(lockedSeed);
      } else {
        const random = randomSeed();
        generationSeed = random;
        setSeed(random);
      }
    }

    setIsGenerating(true);
    try {
      const blob = await generateNavatar({
        prompt: finalPrompt,
        avoid: baseNegativePrompt,
        onBrand,
        seed: generationSeed,
      });
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      toast({ text: "Navatar generated ✓", kind: "ok" });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Error generating image";
      toast({ text: message, kind: "err" });
    } finally {
      setIsGenerating(false);
    }
  }

  const canSave = Boolean(file) && !isGenerating;

  return (
    <main className="navatar-generate page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Describe & Generate" }]}
        />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Describe &amp; Generate</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <form
        onSubmit={onSave}
        style={{ maxWidth: 520, margin: "16px auto", display: "grid", justifyItems: "center", gap: 12 }}
      >
        <NavatarCard src={draftUrl} title={name || "My Navatar"} />
        <div className="navatar-field">
          <label htmlFor="navatar-prompt">Describe your Navatar</label>
          <textarea
            id="navatar-prompt"
            rows={4}
            placeholder="Friendly nature guide, glowing shell, playful pose…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <label className="navatar-toggle" htmlFor="navatar-brand-style">
          <input
            id="navatar-brand-style"
            type="checkbox"
            checked={onBrand}
            onChange={(e) => setOnBrand(e.target.checked)}
            disabled={isGenerating}
          />
          <span>
            Naturverse Navatar style
            <small>Wraps your prompt in our bright, friendly brand art direction.</small>
          </span>
        </label>
        <div className="navatar-field">
          <label htmlFor="navatar-style">Style preset</label>
          <div className="navatar-style-picker">
            <select
              id="navatar-style"
              className="navatar-style-select"
              value={selectedStyle.id}
              onChange={(e) => setStyleId(e.target.value)}
              disabled={isGenerating}
            >
              {STYLE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
            <div className="navatar-style-preview">
              <strong>{selectedStyle.label}</strong>
              <p>{selectedStyle.description}</p>
            </div>
          </div>
        </div>
        <div
          className={`navatar-keep-style${!user?.id ? " navatar-keep-style--disabled" : ""}`}
        >
          <div className="navatar-keep-style__row">
            <input
              id="navatar-keep-style"
              type="checkbox"
              checked={seedLocked && Boolean(user?.id)}
              onChange={(e) => handleSeedToggle(e.target.checked)}
              disabled={!user?.id || isGenerating}
            />
            <label htmlFor="navatar-keep-style">
              Keep style consistent (seed)
              <small>
                {user?.id
                  ? "Uses your account seed so regenerations keep the same vibe."
                  : "Sign in to lock a style seed to your Navatar."}
              </small>
            </label>
          </div>
          <div className="navatar-keep-style__seed" aria-live="polite">
            <span className="navatar-seed-label">Seed</span>
            <code>{seedLocked && typeof seed === "number" ? seed : "—"}</code>
            <button
              type="button"
              className="navatar-seed-dice"
              onClick={handleRandomizeSeed}
              disabled={!seedLocked || !user?.id || isGenerating}
            >
              <span aria-hidden>🎲</span>
              <span>Roll new seed</span>
            </button>
          </div>
        </div>
        <details className="navatar-advanced">
          <summary>Advanced prompt controls</summary>
          <div className="navatar-advanced__content">
            <p>
              We always filter out: <code>{alwaysFilteredPrompt}</code>
            </p>
            <label htmlFor="navatar-negative">Add more things to avoid (optional)</label>
            <textarea
              id="navatar-negative"
              rows={3}
              placeholder="e.g., spooky shadows, cluttered background"
              value={extraNegativePrompt}
              onChange={(e) => setExtraNegativePrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </details>
        <button
          type="button"
          className="pill pill--primary"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating…" : "Generate with Hugging Face FLUX"}
        </button>
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isGenerating}
        />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }} disabled={!canSave}>
          {isGenerating ? "Generating…" : "Save"}
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        Powered by Hugging Face FLUX – square 1024×1024 art.
      </p>
    </main>
  );
}

