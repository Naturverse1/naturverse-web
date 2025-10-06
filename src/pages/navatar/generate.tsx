import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import { generateNavatar, type ProviderOption } from "@/shared/image";
import { logEvent } from "@/lib/activity";
import "../../styles/navatar.css";

const PROVIDERS: { label: string; value: ProviderOption }[] = [
  { label: "Auto (OpenAI → Stability → DeepAI → HF → Basic)", value: "auto" },
  { label: "OpenAI", value: "openai" },
  { label: "Stability", value: "stability" },
  { label: "DeepAI", value: "deepai" },
  { label: "Hugging Face", value: "huggingface" },
  { label: "Basic (Multiavatar)", value: "multiavatar" },
];

const PROVIDER_LABEL: Record<ProviderOption, string> = {
  auto: "Auto",
  openai: "OpenAI",
  stability: "Stability",
  deepai: "DeepAI",
  huggingface: "Hugging Face",
  multiavatar: "Multiavatar",
};

const SIZE_OPTIONS = ["512", "1024", "1024x1024", "1536x1536"] as const;
const PROVIDER_STORAGE_KEY = "navatar:provider:v2";

export default function DescribeAndGeneratePage() {
  const toast = useToast();
  const nav = useNavigate();
  const [provider, setProvider] = useState<ProviderOption>("auto");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<string>("1024");
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<ProviderOption | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(PROVIDER_STORAGE_KEY) as ProviderOption | null;
    if (saved && (PROVIDERS.some((it) => it.value === saved))) {
      setProvider(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROVIDER_STORAGE_KEY, provider);
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
      const result = await generateNavatar({ prompt: prompt.trim(), provider, size });
      setUsedProvider(result.provider);

      try {
        const response = await fetch(result.dataUrl);
        if (!response.ok) {
          throw new Error(`Failed to load generated image (${response.status})`);
        }
        const blob = await response.blob();
        const mime = blob.type || "image/png";
        const extension = mime === "image/svg+xml" ? "svg" : "png";
        const file = new File([blob], `navatar-${Date.now()}.${extension}`, { type: mime });
        const localUrl = URL.createObjectURL(blob);
        setGeneratedFile(file);
        setObjectUrl(localUrl);
        setPreviewUrl(localUrl);
        void logEvent("avatar.created", { method: "generate", provider: result.provider, size });
      } catch (err) {
        console.error(err);
        setPreviewUrl(result.dataUrl);
        toast({
          text: "Generation succeeded, but we couldn't prepare the image for saving.",
          kind: "err",
        });
      }
    } catch (e) {
      console.error(e);
      toast({ text: "Generation failed. Try another provider or check API keys.", kind: "err" });
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

  const canSave = Boolean(generatedFile) && !isSaving;
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
        <div className="row" style={{ marginBottom: "0.75rem", width: "100%", alignItems: "center" }}>
          <label style={{ marginRight: 8 }}>Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ProviderOption)}
            disabled={isGenerating || isSaving}
          >
            {PROVIDERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small style={{ marginLeft: 8 }}>
            Auto mode falls back in order: OpenAI → Stability → DeepAI → Hugging Face → Multiavatar.
          </small>
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
          <select value={size} onChange={(e) => setSize(e.target.value)} disabled={isGenerating || isSaving}>
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
          Generated with {PROVIDER_LABEL[usedProvider]}.
        </p>
      )}
    </main>
  );
}
