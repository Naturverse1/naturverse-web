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
import { generateNavatar } from "@/lib/navatar/ai";
import "../../styles/navatar.css";

const MAX_SEED = 0xffff_ffff; // 4294967295

function seedFromUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  const normalized = (hash >>> 0) % MAX_SEED;
  return normalized === 0 ? 1 : normalized;
}

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [avoidPrompt, setAvoidPrompt] = useState("");
  const [keepStyle, setKeepStyle] = useState(false);
  const [onBrand, setOnBrand] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const stableSeed = useMemo(() => (user?.id ? seedFromUserId(user.id) : undefined), [user?.id]);

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

    setError(null);
    setIsGenerating(true);
    try {
      const seed = keepStyle && typeof stableSeed === "number" ? stableSeed : undefined;
      const avoid = avoidPrompt.trim();
      const dataUrl = await generateNavatar({
        prompt: trimmedPrompt,
        onBrand,
        avoid,
        seed,
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      setFile(generatedFile);
      toast({ text: "Navatar generated ✓", kind: "ok" });
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Generation failed";
      setError(
        message.includes("Hugging Face")
          ? "Hugging Face error — tap for details in console"
          : message || "Generation failed"
      );
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
        className="navatar-generate"
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
            <p>We always apply our default safety filters. Add more specifics to avoid below.</p>
            <label htmlFor="navatar-negative">Add more things to avoid (optional)</label>
            <textarea
              id="navatar-negative"
              rows={3}
              placeholder="e.g., spooky shadows, cluttered background"
              value={avoidPrompt}
              onChange={(e) => setAvoidPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </details>
        <button
          type="button"
          className="pill primary"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating…" : "Generate with Hugging Face"}
        </button>
        {error ? (
          <p className="navatar-error" role="alert">
            {error}
          </p>
        ) : null}
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

