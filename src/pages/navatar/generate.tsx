import * as React from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../lib/session";
import "../../styles/navatar.css";

export default function NavatarGenerate() {
  const user = useSession();
  const [prompt, setPrompt] = React.useState("");
  const [srcUrl, setSrcUrl] = React.useState("");
  const [maskUrl, setMaskUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: user?.id || null,
          name: name || null,
          size: "1024x1024",
          sourceImageUrl: srcUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        setErr(t || `HTTP ${res.status}`);
        return;
      }

      // on success, refresh the Navatar page
      location.assign("/navatar?refresh=1");
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <nav className="crumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> /{" "}
        <span>Describe &amp; Generate</span>
      </nav>
      <h1 className="h1">Describe &amp; Generate</h1>

      <form className="card-center" onSubmit={onSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder={`Describe your Navatar (e.g., "friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style")`}
          style={{ width: "100%", marginBottom: 12 }}
        />
        <input
          value={srcUrl}
          onChange={(e) => setSrcUrl(e.target.value)}
          placeholder="(Optional) Source Image URL for edits/merge"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          value={maskUrl}
          onChange={(e) => setMaskUrl(e.target.value)}
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button className="btn-primary" disabled={busy}>
          {busy ? "Creating..." : "Save"}
        </button>
        {err && (
          <p className="error" style={{ whiteSpace: "pre-wrap" }}>
            {err}
          </p>
        )}

        <p
          style={{
            marginTop: 12,
            color: "#6b7280",
            border: "1px dashed #e5e7eb",
            padding: 12,
            borderRadius: 8,
          }}
        >
          Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook /
          illustration / character sheet” for that Navatar vibe.
        </p>
      </form>
    </div>
  );
}

