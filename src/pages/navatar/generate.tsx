import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { generateImageWithStability } from "../../lib/ai/stability";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

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
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast({ text: "Describe your Navatar first", kind: "err" });
      return;
    }

    setIsGenerating(true);
    try {
      toast({ text: "Generating image with Stability…", kind: "warn" });

      const { image } = await generateImageWithStability(trimmed, { width: 768, height: 1024 });
      const dataUrl = `data:image/png;base64,${image}`;
      const pngBlob = await (await fetch(dataUrl)).blob();
      const generatedFile = new File([pngBlob], `navatar-${Date.now()}.png`, { type: "image/png" });

      setDraftUrl(dataUrl);
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

