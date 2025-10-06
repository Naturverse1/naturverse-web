import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import { generateImage } from "@/lib/image/generate";
import {
  getSelectedProvider,
  setSelectedProvider,
  type Provider,
  listProviders,
  providerLabel,
} from "@/lib/image/providers";
import { logEvent } from "@/lib/activity";
import "../../styles/navatar.css";

const SIZE_OPTIONS = [512, 1024, 2048] as const;

export default function DescribeAndGeneratePage() {
  const toast = useToast();
  const nav = useNavigate();
  const [provider, setProvider] = useState<Provider>(getSelectedProvider());
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<number>(1024);
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<Provider | null>(null);
  const providerOptions = listProviders();

  useEffect(() => {
    setSelectedProvider(provider);
  }, [provider]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  async function onGenerate() {
    if (!prompt.trim()) {
      toast({ text: "Enter a description first.", kind: "warn" });
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    setIsGenerating(true);
    setGeneratedFile(null);
    setPreviewUrl(null);
    setUsedProvider(null);

    try {
      const { imageUrl, provider: used } = await generateImage({
        provider,
        prompt: prompt.trim(),
        size,
      });
      setUsedProvider(used);
      setPreviewUrl(imageUrl);

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `navatar-${Date.now()}.png`, {
          type: blob.type || "image/png",
        });
        const localUrl = URL.createObjectURL(blob);
        setGeneratedFile(file);
        setObjectUrl(localUrl);
        setPreviewUrl(localUrl);
        void logEvent("avatar.created", { method: "generate", provider: used, size });
      } catch (err) {
        console.error(err);
        setPreviewUrl(imageUrl);
        toast({
          text: "Generation succeeded, but we couldn't prepare the image for saving.",
          kind: "err",
        });
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Generation failed.";
      toast({ text: message || "Generation failed.", kind: "err" });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving) return;

    if (!generatedFile) {
      toast({ text: "Generate an image first.", kind: "err" });
      return;
    }

    setIsSaving(true);
    try {
      const row = await uploadNavatar(generatedFile, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      const methodProvider = usedProvider ?? provider;
      void logEvent("avatar.saved", { method: "generate", provider: methodProvider, id: row.id });
      nav("/navatar");
    } catch (error) {
      console.error(error);
      toast({ text: "Save failed", kind: "err" });
    } finally {
      setIsSaving(false);
    }
  }

  const canSave = Boolean(generatedFile) && !isSaving && !isGenerating;
  const cardTitle = name.trim() || "My Navatar";

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
        <div className="navatar-generator-switch" role="tablist" aria-label="Image provider">
          {providerOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`pill${provider === option.id ? " pill--active" : ""}`}
              onClick={() => setProvider(option.id)}
              disabled={isGenerating || isSaving}
            >
              {option.label}
            </button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your Navatar…"
          rows={3}
          style={{ width: "100%", marginBottom: "0.5rem" }}
          disabled={isGenerating || isSaving}
        />
        <div style={{ marginBottom: "0.75rem", width: "100%" }}>
          <label>Size</label>{" "}
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} disabled={isGenerating || isSaving}>
            {SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary" type="button" onClick={onGenerate} disabled={isGenerating || isSaving}>
          {isGenerating ? "Generating…" : "Generate"}
        </button>

        <NavatarCard src={previewUrl ?? undefined} title={cardTitle} />

        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }} disabled={!canSave}>
          {isSaving ? "Saving…" : "Save"}
        </button>
      </form>
      {previewUrl && usedProvider && (
        <p className="center" style={{ opacity: 0.8 }}>
          Generated with {providerLabel(usedProvider)}.
        </p>
      )}
    </main>
  );
}
