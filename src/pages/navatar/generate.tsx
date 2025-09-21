import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { useToast } from "../../components/Toast";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import {
  MAX_SEED,
  RATE_LIMIT_MESSAGE,
  RateLimitError,
  generateWithStability,
} from "../../lib/navatar/stability";
import "../../styles/navatar.css";

const DEFAULT_NAME = "My Navatar";
const DEFAULT_STYLE_PRESET = "comic-book";
const CARTOON_STYLE_HINT =
  "bright comic-book character, thick clean outlines, playful proportions, simplified shapes, bold colors, friendly expression";

function stylizePrompt(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const needsPeriod = !/[.!?]$/.test(trimmed);
  return `${trimmed}${needsPeriod ? "." : ""} ${CARTOON_STYLE_HINT}`;
}

function randomSeed(): number {
  return Math.max(1, Math.floor(Math.random() * MAX_SEED));
}

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [avoid, setAvoid] = useState("");
  const [seed, setSeed] = useState<number>(() => randomSeed());
  const [keepSeed, setKeepSeed] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    const finalPrompt = stylizePrompt(trimmed);
    const seedForRequest = keepSeed ? seed : undefined;

    setIsGenerating(true);
    try {
      const { blob, remaining } = await generateWithStability({
        prompt: finalPrompt,
        avoid,
        seed: seedForRequest,
        keepSeed,
        stylePreset: DEFAULT_STYLE_PRESET,
      });

      const nextUrl = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextUrl;
      });
      toast({ text: "Navatar generated ✓", kind: "ok" });

      if (!keepSeed) {
        setSeed(randomSeed());
      }

      if (typeof remaining === "number" && remaining <= 0) {
        toast({ text: RATE_LIMIT_MESSAGE, kind: "warn" });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof RateLimitError) {
        toast({ text: error.message, kind: "warn" });
      } else {
        const message = error instanceof Error ? error.message : "Error generating image";
        toast({ text: message || "Error generating image", kind: "err" });
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUseAsNavatar() {
    if (!previewUrl) {
      toast({ text: "Generate an image first", kind: "err" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(previewUrl);
      if (!response.ok) {
        throw new Error("Unable to access generated image");
      }
      const blob = await response.blob();
      const file = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      const row = await uploadNavatar(file, DEFAULT_NAME);
      setActiveNavatarId(row.id);
      toast({ text: "Navatar saved ✓", kind: "ok" });
      navigate("/navatar");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to save Navatar";
      toast({ text: message || "Failed to save Navatar", kind: "err" });
    } finally {
      setIsSaving(false);
    }
  }

  const busy = isGenerating || isSaving;

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/navatar", label: "Navatar" },
            { label: "Describe & Generate" },
          ]}
        />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Describe &amp; Generate</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />

      <section className="generate-panel">
        <div className="generate-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Generated Navatar" className="generate-preview__image" />
          ) : (
            <div className="generate-preview__placeholder">{DEFAULT_NAME}</div>
          )}
        </div>

        <div className="generate-actions">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={busy}
            className="btn btn-primary"
          >
            {isGenerating ? "Generating…" : previewUrl ? "Regenerate" : "Generate"}
          </button>
          <button
            type="button"
            onClick={handleUseAsNavatar}
            disabled={!previewUrl || busy}
            className="btn btn-secondary"
          >
            {isSaving ? "Saving…" : "Use as Navatar"}
          </button>
          <label className="seed-toggle">
            <input
              type="checkbox"
              checked={keepSeed}
              onChange={(event) => setKeepSeed(event.target.checked)}
              disabled={busy}
            />
            <span className="seed-toggle__text">Keep style consistent (seed)</span>
            <span className={`seed-pill${keepSeed ? "" : " seed-pill--inactive"}`}>
              Seed #{seed}
            </span>
          </label>
        </div>

        <div className="navatar-field">
          <label htmlFor="navatar-prompt">Describe your Navatar</label>
          <textarea
            id="navatar-prompt"
            rows={3}
            placeholder="e.g., funny cartoon frog with a tiny cape"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={isGenerating}
          />
        </div>

        <details className="navatar-advanced">
          <summary>Advanced prompt controls</summary>
          <div className="navatar-advanced__content">
            <label htmlFor="navatar-avoid">Add things to avoid (optional)</label>
            <input
              id="navatar-avoid"
              className="input"
              placeholder="e.g., scary, realistic lighting"
              value={avoid}
              onChange={(event) => setAvoid(event.target.value)}
              disabled={busy}
            />
            <p>
              We already avoid photos, logos, and text automatically. Add anything else you don’t want to see.
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}
