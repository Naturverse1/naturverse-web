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
import { buildDicebearUrl, createDicebearAvatar, type DicebearStyle } from "../../lib/navatar/dicebear";
import {
  DEFAULT_STYLE_ID,
  RATE_LIMIT_MESSAGE,
  RateLimitError,
  STYLE_PRESETS,
  StabilityError,
  buildNegativePrompt,
  buildPrompt,
  generateWithStability,
  seedFromUserId,
} from "../../lib/navatar/stability";
import "../../styles/navatar.css";

type GeneratorMode = "stability" | "dicebear";

const DICEBEAR_STYLE_OPTIONS: { value: DicebearStyle; label: string }[] = [
  { value: "adventurer", label: "Adventurer" },
  { value: "adventurer-neutral", label: "Adventurer Neutral" },
  { value: "avataaars", label: "Avataaars" },
  { value: "micah", label: "Micah" },
  { value: "open-peeps", label: "Open Peeps" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "pixel-art-neutral", label: "Pixel Art Neutral" },
  { value: "fun-emoji", label: "Fun Emoji" },
  { value: "notionists", label: "Notionists" },
  { value: "shapes", label: "Shapes" },
];

const DEFAULT_DICEBEAR_STYLE = DICEBEAR_STYLE_OPTIONS[0]?.value ?? "adventurer";

const BRAND_STYLE = [
  "cute character, navatar style, bright friendly palette,",
  "big expressive eyes, rounded shapes, thick clean outlines,",
  "storybook illustration, flat lighting, soft shading,",
  "kid-friendly, sticker-ready, high contrast, no tiny details",
].join(" ");

const BRAND_NEGATIVE = [
  "photo, photorealistic, hyperrealistic,",
  "text, caption, letters, logo, watermark, signature,",
  "grain, noise, artifacts, extra limbs, deformed hands",
].join(", ");

function wrapWithBrandStyle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const needsPeriod = !/[.!?]$/.test(trimmed);
  const base = needsPeriod ? `${trimmed}.` : trimmed;
  return `${base} ${BRAND_STYLE}`;
}

export default function GenerateNavatarPage() {
  const [mode, setMode] = useState<GeneratorMode>("stability");
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState(DEFAULT_STYLE_ID);
  const [extraNegativePrompt, setExtraNegativePrompt] = useState("");
  const [keepStyle, setKeepStyle] = useState(false);
  const [onBrand, setOnBrand] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [stabilityPreviewUrl, setStabilityPreviewUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dicebearStyle, setDicebearStyle] = useState<DicebearStyle>(DEFAULT_DICEBEAR_STYLE);
  const [dicebearSeed, setDicebearSeed] = useState("");
  const [dicebearBackground, setDicebearBackground] = useState("");
  const [dicebearSeedTouched, setDicebearSeedTouched] = useState(false);
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuthUser();

  useEffect(() => {
    if (!file) {
      setStabilityPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setStabilityPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (user?.id) {
      setKeepStyle((prev) => (prev ? prev : true));
    } else {
      setKeepStyle(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && !dicebearSeedTouched) {
      setDicebearSeed(user.id);
    }
  }, [user?.id, dicebearSeedTouched]);

  const selectedStyle = useMemo(
    () => STYLE_PRESETS.find((preset) => preset.id === styleId) ?? STYLE_PRESETS[0],
    [styleId]
  );

  const alwaysFilteredPrompt = useMemo(
    () => buildNegativePrompt(onBrand ? BRAND_NEGATIVE : ""),
    [onBrand]
  );

  const dicebearSeedValue = dicebearSeed.trim() || user?.id || "naturverse";
  const dicebearBackgroundValue = dicebearBackground.trim().replace(/^#/, "");

  const dicebearPreviewUrl = useMemo(
    () =>
      buildDicebearUrl({
        style: dicebearStyle,
        seed: dicebearSeedValue || "naturverse",
        backgroundColor: dicebearBackgroundValue || undefined,
        format: "svg",
      }),
    [dicebearStyle, dicebearSeedValue, dicebearBackgroundValue]
  );

  const previewUrl = mode === "stability" ? stabilityPreviewUrl : dicebearPreviewUrl;
  const isDicebear = mode === "dicebear";
  const isStability = mode === "stability";

  const canSave = isDicebear ? !isSaving : Boolean(file) && !isGenerating && !isSaving;
  const saveLabel = isSaving ? "Saving…" : isStability && isGenerating ? "Generating…" : "Save";
  const cardTitle = name || (isDicebear ? dicebearSeedValue : "My Navatar");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (isSaving) return;

    if (mode === "dicebear") {
      setIsSaving(true);
      try {
        const { row } = await createDicebearAvatar(
          {
            style: dicebearStyle,
            seed: dicebearSeedValue || "naturverse",
            backgroundColor: dicebearBackgroundValue || undefined,
            format: "png",
            size: 1024,
          },
          name || undefined
        );
        setActiveNavatarId(row.id);
        toast({ text: "Saved ✓", kind: "ok" });
        nav("/navatar");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Save failed";
        toast({ text: message, kind: "err" });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!file) {
      toast({ text: "Add or generate an image first", kind: "err" });
      return;
    }

    setIsSaving(true);
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      nav("/navatar");
    } catch {
      toast({ text: "Save failed", kind: "err" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleGenerate() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    const promptForBrand = onBrand ? wrapWithBrandStyle(trimmedPrompt) : trimmedPrompt;
    const finalPrompt = buildPrompt(promptForBrand, selectedStyle);
    const negativeExtras = [onBrand ? BRAND_NEGATIVE : "", extraNegativePrompt.trim()]
      .filter(Boolean)
      .join(", ");
    const negativePrompt = buildNegativePrompt(negativeExtras);
    const seed = keepStyle && user?.id ? seedFromUserId(user.id) : undefined;
    setIsGenerating(true);
    try {
      const { blob } = await generateWithStability({
        prompt: finalPrompt,
        negativePrompt,
        seed,
        style: selectedStyle.id,
      });

      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      toast({ text: "Navatar generated ✓", kind: "ok" });
    } catch (error) {
      console.error(error);
      if (error instanceof RateLimitError) {
        toast({ text: error.message || RATE_LIMIT_MESSAGE, kind: "err" });
      } else if (error instanceof StabilityError) {
        toast({ text: error.message, kind: "err" });
      } else if (error instanceof Error) {
        toast({ text: error.message, kind: "err" });
      } else {
        toast({ text: "Error generating image", kind: "err" });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
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
        <div className="navatar-generator-switch" role="group" aria-label="Navatar creation mode">
          <button
            type="button"
            className={`pill${isStability ? " pill--active" : ""}`}
            onClick={() => setMode("stability")}
            aria-pressed={isStability}
          >
            AI (Stability)
          </button>
          <button
            type="button"
            className={`pill${isDicebear ? " pill--active" : ""}`}
            onClick={() => setMode("dicebear")}
            aria-pressed={isDicebear}
          >
            Free (DiceBear)
          </button>
        </div>
        <NavatarCard src={previewUrl} title={cardTitle} />
        {isDicebear ? (
          <>
            <div className="navatar-field">
              <label htmlFor="dicebear-style">Style</label>
              <select
                id="dicebear-style"
                className="navatar-style-select"
                value={dicebearStyle}
                onChange={(e) => setDicebearStyle(e.target.value as DicebearStyle)}
                disabled={isSaving}
              >
                {DICEBEAR_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-seed">Seed (name or handle)</label>
              <input
                id="dicebear-seed"
                value={dicebearSeed}
                onChange={(e) => {
                  setDicebearSeed(e.target.value);
                  setDicebearSeedTouched(true);
                }}
                placeholder={dicebearSeedValue}
                disabled={isSaving}
                style={{ width: "100%" }}
              />
              <small style={{ color: "#1e3a8a" }}>Same seed = same avatar every time.</small>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-bg">Background color (optional)</label>
              <input
                id="dicebear-bg"
                value={dicebearBackground}
                onChange={(e) => setDicebearBackground(e.target.value)}
                placeholder="#b6e3f4"
                disabled={isSaving}
                style={{ width: "100%" }}
              />
              <small style={{ color: "#1e3a8a" }}>Hex color, with or without the #.</small>
            </div>
          </>
        ) : (
          <>
            <div className="navatar-field">
              <label htmlFor="navatar-prompt">Describe your Navatar</label>
              <textarea
                id="navatar-prompt"
                rows={4}
                placeholder="Friendly nature guide, glowing shell, playful pose…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating || isSaving}
              />
            </div>
            <label className="navatar-toggle" htmlFor="navatar-brand-style">
              <input
                id="navatar-brand-style"
                type="checkbox"
                checked={onBrand}
                onChange={(e) => setOnBrand(e.target.checked)}
                disabled={isGenerating || isSaving}
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
                  disabled={isGenerating || isSaving}
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
            <label
              className={`navatar-keep-style${!user?.id ? " navatar-keep-style--disabled" : ""}`}
              htmlFor="navatar-keep-style"
            >
              <input
                id="navatar-keep-style"
                type="checkbox"
                checked={keepStyle && Boolean(user?.id)}
                onChange={(e) => setKeepStyle(e.target.checked)}
                disabled={!user?.id || isGenerating || isSaving}
              />
              <span>
                Keep style consistent
                <small>
                  {user?.id
                    ? "Uses your account seed so regenerations keep the same vibe."
                    : "Sign in to lock a style seed to your Navatar."}
                </small>
              </span>
            </label>
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
                  disabled={isGenerating || isSaving}
                />
              </div>
            </details>
            <button
              type="button"
              className="generate-btn w-full rounded-xl px-5 py-3 text-base font-semibold text-white bg-blue-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerate}
              disabled={isGenerating || isSaving}
            >
              {isGenerating ? "Generating…" : "Generate with Stability AI"}
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isGenerating || isSaving}
            />
          </>
        )}
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }} disabled={!canSave}>
          {saveLabel}
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        {isStability
          ? "Powered by Stability AI (Stable Image Core) – square 512×512 art."
          : "Powered by DiceBear avatars — saved straight to your Supabase storage."}
      </p>
    </main>
  );
}

