import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@/styles/navatar.css";

export default function GenerateNavatar() {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [sourceImageUrl, setSourceImageUrl] = useState("");
  const [maskImageUrl, setMaskImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          name: name.trim() || null,
          userId: (window as any)?.__user?.id || null,
          size: "1024x1024",
          sourceImageUrl: sourceImageUrl.trim() || undefined,
          maskImageUrl: maskImageUrl.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setErr(text || `HTTP ${res.status}`);
        return;
      }
      const { image_url } = await res.json();
      nav("/navatar?refresh=1", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nv-wrap">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / <span>Describe &amp; Generate</span>
      </nav>
      <h1 className="nv-h1">Describe &amp; Generate</h1>

      <form className="nv-card" onSubmit={onSubmit}>
        <div className="nv-field">
          <textarea className="nv-textarea"
            placeholder={`Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')`}
            value={prompt} onChange={e=>setPrompt(e.target.value)} />
        </div>

        <div className="nv-field">
          <input className="nv-input"
            placeholder="(Optional) Source Image URL for edits/merge"
            value={sourceImageUrl} onChange={e=>setSourceImageUrl(e.target.value)} />
        </div>

        <div className="nv-field">
          <input className="nv-input"
            placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
            value={maskImageUrl} onChange={e=>setMaskImageUrl(e.target.value)} />
        </div>

        <div className="nv-field">
          <input className="nv-input" placeholder="Name (optional)"
            value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <button className="nv-btn nv-btn-primary" disabled={busy}>
          {busy ? "Creating..." : "Save"}
        </button>

        {!!err && <div className="nv-error">{err}</div>}

        <p style={{marginTop:14, color:"#7a8799"}}>
          Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </form>
    </div>
  );
}
