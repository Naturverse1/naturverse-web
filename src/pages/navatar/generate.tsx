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
import {
  DEFAULT_NEGATIVE_PROMPT,
  DEFAULT_STYLE_ID,
  MAX_SEED,
  RATE_LIMIT_MESSAGE,
  RateLimitError,
  STYLE_PRESETS,
  buildNegativePrompt,
  buildPrompt,
  generateWithAI,
  seedFromUserId,
} from "../../lib/navatar/stability";
import "../../styles/navatar.css";

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
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState(DEFAULT_STYLE_ID);
  const [extraNegativePrompt, setExtraNegativePrompt] = useState("");
  const [keepStyle, setKeepStyle] = useState(false);
  const [onBrand, setOnBrand] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<"generate" | "regenerate" | null>(null);
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
      setKeepStyle((prev) => (prev ? prev : true));
    } else {
      setKeepStyle(false);
    }
  }, [user?.id]);

  const selectedStyle = useMemo(
    () => STYLE_PRESETS.find((preset) => preset.id === styleId) ?? STYLE_PRESETS[0],
    [styleId]
  );

  const stableSeed = useMemo(() => (user?.id ? seedFromUserId(user.id) : undefined), [user?.id]);

  const alwaysFilteredPrompt = useMemo(
    () => (onBrand ? `${DEFAULT_NEGATIVE_PROMPT}, ${BRAND_NEGATIVE}` : DEFAULT_NEGATIVE_PROMPT),
    [onBrand]
  );

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

  async function runGeneration(mode: "generate" | "regenerate" = "generate") {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    const promptForBrand = onBrand ? wrapWithBrandStyle(trimmedPrompt) : trimmedPrompt;
    const finalPrompt = buildPrompt(promptForBrand, selectedStyle);
    const baseNegativePrompt = buildNegativePrompt(extraNegativePrompt);
    const combinedNegativePrompt = onBrand
      ? `${baseNegativePrompt}, ${BRAND_NEGATIVE}`
      : baseNegativePrompt;

    const generationSeed =
      keepStyle && typeof stableSeed === "number"
        ? stableSeed
        : Math.floor(Math.random() * MAX_SEED) || 1;

    setIsGenerating(true);
    setGenerationMode(mode);
    try {
      const { blob, remaining, provider } = await generateWithAI({
        prompt: finalPrompt,
        negativePrompt: combinedNegativePrompt,
        seed: generationSeed,
        size: "1024x1024",
        style: selectedStyle.id,
        onBrand,
      });
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      const providerName = provider?.toLowerCase();
      const providerLabel =
        providerName === "huggingface"
          ? "Hugging Face"
          : providerName === "stability"
            ? "Stability AI"
            : null;
      toast({
        text: providerLabel ? `Navatar generated with ${providerLabel} ✓` : "Navatar generated ✓",
        kind: "ok",
      });

      if (typeof remaining === "number" && remaining <= 0) {
        toast({ text: RATE_LIMIT_MESSAGE, kind: "warn" });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RateLimitError) {
        toast({ text: error.message, kind: "warn" });
      } else {
        const message = error instanceof Error ? error.message : "Error generating image";
        toast({ text: message, kind: "err" });
      }
    } finally {
      setIsGenerating(false);
      setGenerationMode(null);
    }
  }

  const canSave = Boolean(file) && !isGenerating;

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
        <label
          className={`navatar-keep-style${!user?.id ? " navatar-keep-style--disabled" : ""}`}
          htmlFor="navatar-keep-style"
        >
          <input
            id="navatar-keep-style"
            type="checkbox"
            checked={keepStyle && Boolean(user?.id)}
            onChange={(e) => setKeepStyle(e.target.checked)}
            disabled={!user?.id || isGenerating}
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
              disabled={isGenerating}
            />
          </div>
        </details>
        {!file ? (
          <button
            type="button"
            className="pill"
            onClick={() => runGeneration("generate")}
            disabled={isGenerating}
            style={{ width: "100%" }}
          >
            {isGenerating && generationMode === "generate" ? "Generating…" : "Generate"}
          </button>
        ) : (
          <button
            type="button"
            className="pill"
            onClick={() => runGeneration("regenerate")}
            disabled={isGenerating}
            style={{ width: "100%" }}
          >
            {isGenerating && generationMode === "regenerate" ? "Regenerating…" : "Regenerate"}
          </button>
        )}
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
          Use as Navatar
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        Powered by Hugging Face (FLUX.1 dev) with Stability AI fallback – single 1024×1024 art.
      </p>
    </main>
  );
}

