import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

const hasStability =
  import.meta.env.VITE_ENABLE_STABILITY === "1" ||
  import.meta.env.VITE_ENABLE_STABILITY === "true";

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!file) {
      setDraftUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setDraftUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

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
    if (!hasStability) {
      toast({ text: "Stability not configured", kind: "err" });
      return;
    }

    if (!prompt.trim()) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to generate image");
      }

      const data: { image?: string } = await res.json();
      if (!data?.image) {
        throw new Error("No image returned");
      }

      // Convert base64 data URI to a File so existing upload flow works.
      const base64 = data.image.split(",")[1];
      if (!base64) {
        throw new Error("Invalid image payload");
      }

      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "image/png" });
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, { type: "image/png" });

      setDraftUrl(data.image);
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
        <textarea
          rows={4}
          placeholder="Describe your Navatar (e.g., friendly water-buffalo spirit)…"
          style={{ width: "100%" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="button"
          className="pill"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ width: "100%" }}
        >
          {isGenerating ? "Generating…" : "Generate with Stability AI"}
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
        Powered by Stability AI – free tier includes 25 generations/day.
      </p>
    </main>
  );
}

