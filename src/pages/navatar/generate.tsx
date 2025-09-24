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
import { dicebearUrl, type DicebearStyle } from "../../lib/dicebear";
import { generateDicebearAndSave } from "../../lib/navatar/dicebear";
import { logEvent } from "@/lib/activity";
import { flags } from "@/lib/featureFlags";
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
type DicebearBackgroundSelection = "none" | "solid" | "gradientLinear" | "gradientRadial";

const DICEBEAR_STYLE_OPTIONS: { value: DicebearStyle; label: string }[] = [
  { value: "adventurer", label: "Adventurer" },
  { value: "adventurer-neutral", label: "Adventurer Neutral" },
  { value: "avataaars", label: "Avataaars" },
  { value: "big-ears", label: "Big Ears" },
  { value: "big-ears-neutral", label: "Big Ears Neutral" },
  { value: "big-smile", label: "Big Smile" },
  { value: "bottts", label: "Bottts" },
  { value: "croodles", label: "Croodles" },
  { value: "croodles-neutral", label: "Croodles Neutral" },
  { value: "fun-emoji", label: "Fun Emoji" },
  { value: "identicon", label: "Identicon" },
  { value: "initials", label: "Initials" },
  { value: "lorelei", label: "Lorelei" },
  { value: "lorelei-neutral", label: "Lorelei Neutral" },
  { value: "micah", label: "Micah" },
  { value: "notionists", label: "Notionists" },
  { value: "notionists-neutral", label: "Notionists Neutral" },
];

const DEFAULT_DICEBEAR_STYLE = DICEBEAR_STYLE_OPTIONS[0]?.value ?? "adventurer";
const DICEBEAR_SIZE_OPTIONS = [256, 512, 1024, 2048] as const;
const DEFAULT_DICEBEAR_SIZE = 1024;
const DEFAULT_DICEBEAR_RADIUS = 0;
const DEFAULT_DICEBEAR_SCALE = 100;
const DEFAULT_DICEBEAR_TRANSLATE = 0;

const DICEBEAR_BACKGROUND_OPTIONS: { value: DicebearBackgroundSelection; label: string }[] = [
  { value: "none", label: "None (transparent)" },
  { value: "solid", label: "Solid" },
  { value: "gradientLinear", label: "Gradient (linear)" },
  { value: "gradientRadial", label: "Gradient (radial)" },
];

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

function seedFromPrompt(raw: string): string {
  const fallback = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return fallback || "naturverse";
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
  const [dicebearSeedTouched, setDicebearSeedTouched] = useState(false);
  const [dicebearBackgroundType, setDicebearBackgroundType] =
    useState<DicebearBackgroundSelection>("none");
  const [dicebearBackgroundColors, setDicebearBackgroundColors] = useState("");
  const [dicebearSize, setDicebearSize] = useState<number>(DEFAULT_DICEBEAR_SIZE);
  const [dicebearRadius, setDicebearRadius] = useState<number>(DEFAULT_DICEBEAR_RADIUS);
  const [dicebearScale, setDicebearScale] = useState<number>(DEFAULT_DICEBEAR_SCALE);
  const [dicebearTranslateX, setDicebearTranslateX] = useState<number>(DEFAULT_DICEBEAR_TRANSLATE);
  const [dicebearTranslateY, setDicebearTranslateY] = useState<number>(DEFAULT_DICEBEAR_TRANSLATE);
  const [stabilityRemaining, setStabilityRemaining] = useState<number | null>(null);
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
  const dicebearBackgroundColorList = useMemo(
    () =>
      dicebearBackgroundColors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)
        .map((color) => color.replace(/^#/, "").toLowerCase()),
    [dicebearBackgroundColors]
  );
  const dicebearBackgroundTypeValue =
    dicebearBackgroundType === "none" ? undefined : dicebearBackgroundType;
  const dicebearBackgroundColorsValue =
    dicebearBackgroundTypeValue && dicebearBackgroundColorList.length
      ? dicebearBackgroundColorList
      : undefined;
  const isGradientBackground =
    dicebearBackgroundType === "gradientLinear" || dicebearBackgroundType === "gradientRadial";
  const canReverseBackgroundColors =
    isGradientBackground && dicebearBackgroundColorList.length > 1;
  const dicebearBackgroundPlaceholder = isGradientBackground ? "b6e3f4,c0aede" : "#b6e3f4";
  const dicebearBackgroundHelper =
    dicebearBackgroundType === "none"
      ? "Transparent background keeps the sprite floating on your cards."
      : isGradientBackground
        ? "Comma-separated hex colors (e.g. b6e3f4,c0aede). Reverse swaps the gradient order."
        : "Hex color, with or without the #.";

  const dicebearPreviewUrl = useMemo(
    () =>
      dicebearUrl(
        dicebearStyle,
        {
          seed: dicebearSeedValue || "naturverse",
          size: dicebearSize,
          backgroundType: dicebearBackgroundTypeValue,
          backgroundColor: dicebearBackgroundColorsValue,
          radius: dicebearRadius,
          scale: dicebearScale,
          translateX: dicebearTranslateX,
          translateY: dicebearTranslateY,
        },
        "png"
      ),
    [
      dicebearStyle,
      dicebearSeedValue,
      dicebearSize,
      dicebearBackgroundTypeValue,
      dicebearBackgroundColorsValue,
      dicebearRadius,
      dicebearScale,
      dicebearTranslateX,
      dicebearTranslateY,
    ]
  );

  const stabilityEnabled = flags.stability;
  const currentMode = !stabilityEnabled && mode === "stability" ? "dicebear" : mode;
  const previewUrl = currentMode === "stability" ? stabilityPreviewUrl : dicebearPreviewUrl;
  const isDicebear = currentMode === "dicebear";
  const isStability = stabilityEnabled && currentMode === "stability";

  useEffect(() => {
    if (!stabilityEnabled && mode === "stability") {
      setMode("dicebear");
    }
  }, [mode, stabilityEnabled]);

  const canSave = isDicebear ? !isSaving : Boolean(file) && !isGenerating && !isSaving;
  const saveLabel = isSaving ? "Saving…" : isStability && isGenerating ? "Generating…" : "Save";
  const cardTitle = name || (isDicebear ? dicebearSeedValue : "My Navatar");

  function handleRandomDicebearSeed() {
    const randomSeedValue = Math.random().toString(36).slice(2, 10);
    setDicebearSeed(randomSeedValue);
    setDicebearSeedTouched(true);
  }

  function handleReverseBackgroundColors() {
    const values = dicebearBackgroundColors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    if (values.length > 1) {
      setDicebearBackgroundColors(values.reverse().join(", "));
    }
  }

  function handleClearBackground() {
    setDicebearBackgroundType("none");
    setDicebearBackgroundColors("");
  }

  function handleResetCanvas() {
    setDicebearScale(DEFAULT_DICEBEAR_SCALE);
    setDicebearTranslateX(DEFAULT_DICEBEAR_TRANSLATE);
    setDicebearTranslateY(DEFAULT_DICEBEAR_TRANSLATE);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (isSaving) return;

    if (mode === "dicebear") {
      setIsSaving(true);
      try {
        const { row } = await generateDicebearAndSave({
          style: dicebearStyle,
          seed: dicebearSeedValue || "naturverse",
          size: dicebearSize,
          backgroundType: dicebearBackgroundTypeValue,
          backgroundColor: dicebearBackgroundColorsValue,
          radius: dicebearRadius,
          scale: dicebearScale,
          translateX: dicebearTranslateX,
          translateY: dicebearTranslateY,
          name: name || undefined,
        });
        setActiveNavatarId(row.id);
        toast({ text: "Saved ✓", kind: "ok" });
        void logEvent("avatar.created", {
          method: "dicebear",
          style: dicebearStyle,
          seed: dicebearSeedValue,
          background: dicebearBackgroundTypeValue ?? "none",
        });
        void logEvent("avatar.saved", { method: "dicebear", id: row.id });
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
      void logEvent("avatar.saved", { method: "upload", id: row.id });
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
      const { blob, remaining } = await generateWithStability({
        prompt: finalPrompt,
        negativePrompt,
        seed,
        style: selectedStyle.id,
      });
      setStabilityRemaining(typeof remaining === "number" ? remaining : null);

      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      toast({ text: "Navatar generated ✓", kind: "ok" });
      void logEvent("avatar.created", {
        method: "stability",
        style: selectedStyle.id,
        onBrand,
        keepStyle,
      });
    } catch (error) {
      console.error(error);
      if (
        error instanceof RateLimitError ||
        (error instanceof StabilityError && (error.status === 402 || error.status === 429))
      ) {
        setStabilityRemaining(typeof error.remaining === "number" ? error.remaining : 0);
        if (!dicebearSeedTouched) {
          setDicebearSeed(seedFromPrompt(trimmedPrompt || prompt));
          setDicebearSeedTouched(true);
        }
        setMode("dicebear");
        toast({ text: "AI credits low — switched to Free (DiceBear).", kind: "warn" });
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
        {isStability && stabilityRemaining != null && stabilityRemaining <= 5 && (
          <div className="nv-alert" role="status">
            <strong>Heads up:</strong> {stabilityRemaining <= 0 ? "Stability credits are out." : (
              <>Only {stabilityRemaining} Stability credits left today. We'll switch to Free (DiceBear) if you run out.</>
            )}
          </div>
        )}
        <div className="navatar-generator-switch" role="group" aria-label="Navatar creation mode">
          {stabilityEnabled && (
            <button
              type="button"
              className={`pill${isStability ? " pill--active" : ""}`}
              onClick={() => setMode("stability")}
              aria-pressed={isStability}
            >
              AI (Stability)
            </button>
          )}
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
                <input
                  id="dicebear-seed"
                  value={dicebearSeed}
                  onChange={(e) => {
                    setDicebearSeed(e.target.value);
                    setDicebearSeedTouched(true);
                  }}
                  placeholder={dicebearSeedValue}
                  disabled={isSaving}
                  style={{ flex: "1 1 200px", minWidth: 0 }}
                />
                <button
                  type="button"
                  className="pill"
                  onClick={handleRandomDicebearSeed}
                  disabled={isSaving}
                  style={{ flex: "0 0 auto" }}
                >
                  Randomize
                </button>
              </div>
              <small style={{ color: "#1e3a8a" }}>
                Seed = same look every time. Try your handle or tap Randomize for a new vibe.
              </small>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-bg-type">Background</label>
              <select
                id="dicebear-bg-type"
                value={dicebearBackgroundType}
                onChange={(e) => setDicebearBackgroundType(e.target.value as DicebearBackgroundSelection)}
                disabled={isSaving}
              >
                {DICEBEAR_BACKGROUND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-bg">Background colors</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: "100%" }}>
                <input
                  id="dicebear-bg"
                  value={dicebearBackgroundColors}
                  onChange={(e) => setDicebearBackgroundColors(e.target.value)}
                  placeholder={dicebearBackgroundPlaceholder}
                  disabled={isSaving || dicebearBackgroundType === "none"}
                  style={{ flex: "1 1 200px", minWidth: 0 }}
                />
                <button
                  type="button"
                  className="pill"
                  onClick={handleReverseBackgroundColors}
                  disabled={isSaving || !canReverseBackgroundColors}
                  style={{ flex: "0 0 auto" }}
                >
                  Reverse colors
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={handleClearBackground}
                  disabled={isSaving || dicebearBackgroundType === "none"}
                  style={{ flex: "0 0 auto" }}
                >
                  Transparent
                </button>
              </div>
              <small style={{ color: "#1e3a8a" }}>{dicebearBackgroundHelper}</small>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-size">Size</label>
              <select
                id="dicebear-size"
                value={dicebearSize}
                onChange={(e) => setDicebearSize(Number(e.target.value))}
                disabled={isSaving}
              >
                {DICEBEAR_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} px
                  </option>
                ))}
              </select>
              <small style={{ color: "#1e3a8a" }}>
                Quality tip: choose 1024 or 2048 for crisper marketplace cards.
              </small>
            </div>
            <div className="navatar-field">
              <label htmlFor="dicebear-radius">Corner radius ({dicebearRadius}px)</label>
              <input
                id="dicebear-radius"
                type="range"
                min={0}
                max={50}
                step={1}
                value={dicebearRadius}
                onChange={(e) => setDicebearRadius(Number(e.target.value))}
                disabled={isSaving}
                style={{ width: "100%" }}
              />
              <small style={{ color: "#1e3a8a" }}>
                Soft corners help your Navatar sit nicely in rounded frames.
              </small>
            </div>
            <details className="navatar-advanced">
              <summary>Canvas controls (zoom &amp; pan)</summary>
              <div className="navatar-advanced__content">
                <label htmlFor="dicebear-scale">Scale (zoom) {dicebearScale}%</label>
                <input
                  id="dicebear-scale"
                  type="range"
                  min={50}
                  max={200}
                  step={1}
                  value={dicebearScale}
                  onChange={(e) => setDicebearScale(Number(e.target.value))}
                  disabled={isSaving}
                  style={{ width: "100%" }}
                />
                <small style={{ color: "#1e3a8a" }}>
                  Lower numbers zoom out to reveal more of the sprite when the style supports it.
                </small>
                <label htmlFor="dicebear-translate-x">
                  Horizontal shift ({dicebearTranslateX})
                </label>
                <input
                  id="dicebear-translate-x"
                  type="range"
                  min={-100}
                  max={100}
                  step={1}
                  value={dicebearTranslateX}
                  onChange={(e) => setDicebearTranslateX(Number(e.target.value))}
                  disabled={isSaving}
                  style={{ width: "100%" }}
                />
                <label htmlFor="dicebear-translate-y">
                  Vertical shift ({dicebearTranslateY})
                </label>
                <input
                  id="dicebear-translate-y"
                  type="range"
                  min={-100}
                  max={100}
                  step={1}
                  value={dicebearTranslateY}
                  onChange={(e) => setDicebearTranslateY(Number(e.target.value))}
                  disabled={isSaving}
                  style={{ width: "100%" }}
                />
                <small style={{ color: "#1e3a8a" }}>
                  Nudge the art inside the frame to recenter full-body poses.
                </small>
                <button
                  type="button"
                  className="pill"
                  onClick={handleResetCanvas}
                  disabled={isSaving}
                  style={{ marginTop: 8 }}
                >
                  Reset canvas
                </button>
              </div>
            </details>
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

