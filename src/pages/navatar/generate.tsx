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
  RATE_LIMIT_MESSAGE,
  RateLimitError,
  STYLE_PRESETS,
  buildNegativePrompt,
  buildPrompt,
  generateWithStability,
  seedFromUserId,
} from "../../lib/navatar/stability";
import "../../styles/navatar.css";

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

  const alwaysFilteredPrompt = useMemo(() => DEFAULT_NEGATIVE_PROMPT, []);

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
    const shouldKeepSeed = keepStyle && typeof stableSeed === "number";
    const seedToUse = shouldKeepSeed ? stableSeed : undefined;

    setIsGenerating(true);
    try {
      const { blob, remaining } = await generateWithStability({
        prompt: finalPrompt,
        negativePrompt: baseNegativePrompt,
        seed: seedToUse,
        keepSeed: shouldKeepSeed,
        onBrand,
      });
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      toast({ text: "Navatar generated ✓", kind: "ok" });

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
        <button
          type="button"
          className="pill"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ width: "100%" }}
        >
          {isGenerating ? "Generating…" : "Generate Navatar"}
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
        <button
          className="btn btn-primary"
          type="submit"
          style={{ marginTop: 8, width: "100%" }}
          disabled={!canSave}
        >
          Use as Navatar
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        Powered by Hugging Face (free) with a Stability fallback — square 1024×1024 art.
      </p>
    </main>
  );
}

