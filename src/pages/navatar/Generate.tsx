import { useState } from "react";
import Breadcrumbs from "../../components/NavBreadcrumbs";
import Button from "../../components/Button";
import CardImage from "../../components/CardImage";
import "../../styles/navatar.css";

type GenRes = { image_url?: string; width?: number; height?: number; error?: string };

export default function NavatarGenerate() {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();

  async function uploadTemp(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    const r = await fetch("/api/upload-temp", { method: "POST", body });
    if (!r.ok) throw new Error(await r.text());
    const { url } = await r.json();
    return url as string;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(undefined);

    try {
      let sourceImageUrl: string | undefined;
      let maskImageUrl: string | undefined;

      if (sourceFile) sourceImageUrl = await uploadTemp(sourceFile);
      if (maskFile)   maskImageUrl   = await uploadTemp(maskFile);

      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          name,
          sourceImageUrl,
          maskImageUrl,
        }),
      });

      const data: GenRes = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      if (!data.image_url) throw new Error("No image returned");

      setPreview(data.image_url);
      sessionStorage.setItem("navatar_url", data.image_url);
      sessionStorage.setItem("navatar_name", name || "Me");
    } catch (e: any) {
      setErr(e?.message || "Generate failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/navatar", label: "Navatar" }, { label: "Describe & Generate" }]} />
      <h1 className="nv-h1">Describe &amp; Generate</h1>

      <div className="nv-col nv-row">
        <form onSubmit={onSubmit} className="nv-row">
          <textarea
            className="nv-textarea"
            placeholder={`Describe your Navatar (e.g., "friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style")`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <label className="sr-only">Source Image (optional)</label>
          <input type="file" accept="image/*" className="nv-input" onChange={(e) => setSourceFile(e.target.files?.[0] || null)} />

          <label className="sr-only">Mask Image (optional)</label>
          <input type="file" accept="image/*" className="nv-input" onChange={(e) => setMaskFile(e.target.files?.[0] || null)} />

          <input
            className="nv-input"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {err && <div className="nv-tip" style={{ color: "#b91c1c", borderColor: "#fecaca", background: "#fff1f2" }}>{err}</div>}

          <Button type="submit" busy={busy}>Save</Button>
          <div className="nv-tip">
            Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet” for that Navatar vibe.
          </div>
        </form>

        {preview && (
          <>
            <h2 className="nv-h1" style={{ fontSize: 28 }}>Your Navatar</h2>
            <CardImage src={preview} alt={name || "Navatar"} />
          </>
        )}
      </div>
    </div>
  );
}
