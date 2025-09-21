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

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      nav("/navatar");
    } catch {
      toast({ text: "Save failed", kind: "err" });
    }
  }

  const handleGenerate = async () => {
    const bodyPrompt = prompt.trim();
    if (!bodyPrompt) {
      setErr("Please describe your Navatar first.");
      return;
    }

    setLoading(true);
    setErr(undefined);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: bodyPrompt }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || res.statusText);
      const data = JSON.parse(text);
      if (!data.image) throw new Error("No image returned");
      setPreview(data.image);

      const comma = data.image.indexOf(",");
      if (comma === -1) throw new Error("Unexpected image payload");
      const base64 = data.image.slice(comma + 1);
      const byteString = atob(base64);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i += 1) {
        byteArray[i] = byteString.charCodeAt(i);
      }
      const generatedFile = new File([byteArray], "navatar.png", { type: "image/png" });
      setFile(generatedFile);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Generation failed");
    } finally {
      setLoading(false);
    }
  };

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
        <NavatarCard src={preview} title={name || "My Navatar"} />
        <textarea
          rows={4}
          placeholder="Describe your Navatar (e.g., friendly water-buffalo spirit)…"
          style={{ width: "100%" }}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (err) setErr(undefined);
          }}
        />
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <button
            type="button"
            className="ai-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate with Stability AI"}
          </button>
          {err ? (
            <span style={{ color: "#b91c1c", fontSize: "0.9rem", textAlign: "center" }}>{err}</span>
          ) : null}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            if (err) setErr(undefined);
          }}
        />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }} disabled={!file || loading}>
          Save
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        Powered by Stability AI — free tier includes 25 generations/day.
      </p>
    </main>
  );
}

