import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function uploadToStorage(file: File, userId: string | null, folder: string) {
  const ext = file.name.split(".").pop() || "png";
  const path = `${folder}/${userId ?? "anon"}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  // source/mask management
  const [useUrlMode, setUseUrlMode] = useState({ source: false, mask: false });
  const [sourceUrl, setSourceUrl] = useState("");
  const [maskUrl, setMaskUrl] = useState("");

  const [userId] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem("profile");
      return raw ? JSON.parse(raw)?.id ?? null : null;
    } catch {
      return null;
    }
  });

  async function onFilePicked(kind: "source" | "mask", file?: File | null) {
    if (!file) return;
    const uploadedUrl = await uploadToStorage(file, userId, kind === "source" ? "ai-src" : "ai-mask");
    if (kind === "source") setSourceUrl(uploadedUrl);
    else setMaskUrl(uploadedUrl);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: name || undefined,
          prompt: prompt || undefined,
          source_public_url: sourceUrl || undefined,
          mask_public_url: maskUrl || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json?.error || "Create failed");
        return;
      }
      window.location.href = "/navatar?refresh=1";
    } catch (err: any) {
      alert(err?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Describe &amp; Generate</h1>

      <form onSubmit={onSubmit} className="card">
        <textarea
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input wide"
          rows={4}
        />

        {/* SOURCE */}
        <div className="group">
          <label className="label">Source Image (optional)</label>
          {!useUrlMode.source ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFilePicked("source", e.target.files?.[0])}
                className="input wide"
              />
              {sourceUrl && (
                <div className="hint">
                  Uploaded ✓ <a href={sourceUrl} target="_blank" rel="noreferrer">Preview</a>
                </div>
              )}
              <button type="button" className="link" onClick={() => setUseUrlMode((s) => ({ ...s, source: true }))}>
                Paste URL instead
              </button>
            </>
          ) : (
            <>
              <input
                type="url"
                placeholder="(Optional) Source Image URL for edits/merge"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="input wide"
              />
              <button type="button" className="link" onClick={() => setUseUrlMode((s) => ({ ...s, source: false }))}>
                Upload a file instead
              </button>
            </>
          )}
        </div>

        {/* MASK */}
        <div className="group">
          <label className="label">Mask Image (optional, transparent areas → replaced)</label>
          {!useUrlMode.mask ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFilePicked("mask", e.target.files?.[0])}
                className="input wide"
              />
              {maskUrl && (
                <div className="hint">
                  Uploaded ✓ <a href={maskUrl} target="_blank" rel="noreferrer">Preview</a>
                </div>
              )}
              <button type="button" className="link" onClick={() => setUseUrlMode((s) => ({ ...s, mask: true }))}>
                Paste URL instead
              </button>
            </>
          ) : (
            <>
              <input
                type="url"
                placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
                value={maskUrl}
                onChange={(e) => setMaskUrl(e.target.value)}
                className="input wide"
              />
              <button type="button" className="link" onClick={() => setUseUrlMode((s) => ({ ...s, mask: false }))}>
                Upload a file instead
              </button>
            </>
          )}
        </div>

        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input wide"
        />

        <button className="btn primary wide" disabled={creating}>
          {creating ? "Creating..." : "Save"}
        </button>

        <p className="tips">
          Tips: Keep faces centered, ask for full-body vs portrait, and mention
          “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </form>

      <style>{`
        .container { max-width: 900px; margin: 0 auto; padding: 1rem; }
        .title { text-align: left; margin: 1rem 0 1.25rem; }
        .card { background:#fff; border-radius:12px; padding:1rem; box-shadow: 0 8px 24px rgba(0,0,0,.06); }
        .input.wide { width: 100%; }
        .btn.primary.wide { width: 100%; height: 48px; border-radius: 10px; }
        .group { margin: 0.75rem 0; }
        .label { display:block; font-weight: 600; margin-bottom: 0.35rem; }
        .hint { margin-top: .25rem; font-size: .9rem; opacity: .75; }
        .link { margin-top: .25rem; background:none; border:none; color:#2563eb; cursor:pointer; padding:0; }
        .tips { margin-top: .75rem; font-size: .9rem; opacity: .75; }
        @media (max-width: 640px) { .title { text-align:center; } }
      `}</style>
    </div>
  );
}

