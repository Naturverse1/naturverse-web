import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import { generateStabilityPng } from "@/lib/ai/stability";
import { uploadAvatarImage, saveAvatarRow } from "@/lib/navatar/useSupabase";
import { useAuthUser } from "@/lib/useAuthUser";
import "../../styles/navatar.css";

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
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

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) {
      toast({ text: "Please log in first", kind: "err" });
      return;
    }
    if (!file) {
      toast({ text: "Add or generate an image first", kind: "err" });
      return;
    }
    setIsSaving(true);
    try {
      const { publicUrl, path } = await uploadAvatarImage(user.id, file);
      if (!publicUrl) {
        throw new Error("Upload failed");
      }

      const { data, error } = await saveAvatarRow({
        owner_id: user.id,
        name: name.trim() || null,
        image_url: publicUrl,
        image_path: path,
        meta: generatedPrompt ? { source: "stability", prompt: generatedPrompt } : null,
      });

      if (error) throw error;
      if (!data?.id) {
        throw new Error("Failed to save Navatar");
      }

      setActiveNavatarId(data.id);
      toast({ text: "Saved ✓", kind: "ok" });
      nav("/navatar");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Save failed";
      toast({ text: message, kind: "err" });
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
    if (!user?.id) {
      toast({ text: "Please log in first", kind: "err" });
      return;
    }

    setIsGenerating(true);
    try {
      toast({ text: "Generating image with Stability…", kind: "warn" });
      const blob = await generateStabilityPng(trimmedPrompt);
      const generatedFile = new File([blob], `navatar-${Date.now()}.png`, { type: "image/png" });

      setFile(generatedFile);
      setGeneratedPrompt(trimmedPrompt);
      toast({ text: "Navatar generated ✓", kind: "ok" });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Error generating image";
      toast({ text: message, kind: "err" });
      setGeneratedPrompt(null);
    } finally {
      setIsGenerating(false);
    }
  }

  const canSave = Boolean(file) && !isGenerating && !isSaving;

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
          disabled={isGenerating || isSaving}
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
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setGeneratedPrompt(null);
          }}
          disabled={isGenerating || isSaving}
        />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }} disabled={!canSave}>
          {isSaving ? "Saving…" : isGenerating ? "Generating…" : "Save"}
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        Powered by Stability AI – free tier includes 25 generations/day.
      </p>
    </main>
  );
}

