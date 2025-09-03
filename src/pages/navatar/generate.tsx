import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../lib/session";
import "../../styles/navatar.css";

export default function GenerateNavatar() {
  const navigate = useNavigate();
  const user = useSession();
  const [prompt, setPrompt] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [maskUrl, setMaskUrl] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!user?.id) return alert("Please sign in first.");
    if (!prompt && !sourceUrl) return alert("Enter a prompt or a source image URL.");

    setSaving(true);
    try {
      const r = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          userId: user.id,
          name,
          sourceImageUrl: sourceUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt);
      }
      navigate("/navatar?refresh=1");
    } catch (e: any) {
      alert(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link><span className="sep">/</span>
        <Link to="/navatar">Navatar</Link><span className="sep">/</span>
        <span>Describe & Generate</span>
      </nav>

      <h1>Describe & Generate</h1>

      <div className="nv-form">
        <textarea
          className="nv-input"
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <input
          className="nv-input"
          placeholder="(Optional) Source Image URL for edits/merge"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <input
          className="nv-input"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskUrl}
          onChange={(e) => setMaskUrl(e.target.value)}
        />
        <input
          className="nv-input"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Creating..." : "Save"}
        </button>
      </div>

      <p className="nv-tip">
        Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet”
        for that Navatar vibe.
      </p>
    </div>
  );
}
