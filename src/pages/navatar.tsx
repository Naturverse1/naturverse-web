import { useEffect, useMemo, useState } from "react";
import { supa, publicUrl } from "../lib/supa";
import { NAVATAR_CATALOG } from "../data/navatarCatalog";

type AvatarRow = {
  id: string;
  user_id: string|null;
  name: string|null;
  method: "upload"|"ai"|"canon";
  image_url: string;
};

type Mode = "upload" | "generate" | "canon" | null;

export default function NavatarPage() {
  const [session, setSession] = useState<any>(null);
  const [avatars, setAvatars] = useState<AvatarRow[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);

  // upload state
  const [file, setFile] = useState<File|null>(null);
  // generate state
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  // canon state
  const [canonKey, setCanonKey] = useState<string|null>(null);

  useEffect(() => {
    supa.auth.getSession().then(({ data }) => setSession(data.session));
    load();
  }, []);

  async function load() {
    const { data } = await supa.from("avatars").select("*").order("created_at", { ascending: false });
    setAvatars(data || []);
  }

  async function remove(id: string) {
    await supa.from("avatars").delete().eq("id", id);
    await load();
  }

  function resetModal() {
    setMode(null);
    setFile(null);
    setName("");
    setPrompt("");
    setCanonKey(null);
    setErr(null);
  }

  // --- Actions ---
  async function onSaveUpload() {
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const path = `uploads/${session?.user?.id ?? "anon"}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supa.storage.from("avatars").upload(path, file, { upsert: false });
      if (error) throw error;

      const url = publicUrl(path);
      const { error: insErr } = await supa.from("avatars").insert({
        user_id: session?.user?.id ?? null,
        name: name || file.name.replace(/\.[^/.]+$/, ""),
        method: "upload",
        image_url: url
      });
      if (insErr) throw insErr;

      await load();
      setOpen(false); resetModal();
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveCanon() {
    if (!canonKey) return;
    setBusy(true); setErr(null);
    try {
      const c = NAVATAR_CATALOG.find(c => c.key === canonKey)!;
      const { error } = await supa.from("avatars").insert({
        user_id: session?.user?.id ?? null,
        name: name || c.title,
        method: "canon",
        image_url: c.image_url // direct URL in /public
      });
      if (error) throw error;
      await load();
      setOpen(false); resetModal();
    } catch (e: any) {
      setErr(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    if (!prompt.trim()) return;
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.user?.id ?? null,
          name: name || "AI avatar",
          prompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      await load();
      setOpen(false); resetModal();
    } catch (e: any) {
      setErr(e?.message || "Failed to generate");
    } finally {
      setBusy(false);
    }
  }

  // --- UI helpers ---
  const catalog = useMemo(() => NAVATAR_CATALOG, []);
  const canGenerate = !err || !/403/.test(err); // button remains but message shows

  return (
    <div className="container">
      <h1 className="title">Your Navatar</h1>
      <button className="btn" onClick={() => { setOpen(true); setMode(null); }}>Create Navatar</button>

      {/* Current avatar list (simple: most recent at top) */}
      <div className="current">
        {avatars.map(a => (
          <div key={a.id} className="card">
            {/* If some rows still have a storage path, resolve to public url */}
            <img src={/^https?:/.test(a.image_url) ? a.image_url : publicUrl(a.image_url)} alt={a.name ?? "avatar"} />
            <div className="name">{a.name ?? a.method.toUpperCase()}</div>
            <div className="method">{a.method.toUpperCase()}</div>
            <button className="btn danger" onClick={() => remove(a.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <>
          <div className="backdrop" onClick={() => { setOpen(false); resetModal(); }} />
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <h2>Create Navatar</h2>
              <button className="icon" onClick={() => { setOpen(false); resetModal(); }}>✕</button>
            </div>

            {/* Mode tabs (exclusive) */}
            <div className="modes">
              <button className={`tab ${mode === "upload" ? "active" : ""}`} onClick={() => setMode("upload")}>Upload</button>
              <button className={`tab ${mode === "generate" ? "active" : ""}`} onClick={() => setMode("generate")}>Describe & Generate</button>
              <button className={`tab ${mode === "canon" ? "active" : ""}`} onClick={() => setMode("canon")}>Pick Canon</button>
            </div>

            <input
              className="input"
              placeholder="Name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            {mode === "upload" && (
              <div className="panel">
                <input type="file" accept="image/*"
                       onChange={e => setFile(e.target.files?.[0] ?? null)} />
                {file && <img className="preview" src={URL.createObjectURL(file)} alt="preview" />}
                <button className="btn primary" disabled={!file || busy} onClick={onSaveUpload}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            )}

            {mode === "generate" && (
              <div className="panel">
                <textarea className="textarea" placeholder="Describe your Navatar…" value={prompt}
                          onChange={e => setPrompt(e.target.value)} />
                <button className="btn primary" disabled={!prompt || busy || !canGenerate} onClick={onGenerate}>
                  {busy ? "Generating…" : "Generate"}
                </button>
                {!!err && <p className="error">{err}</p>}
              </div>
            )}

            {mode === "canon" && (
              <div className="panel">
                <div className="grid">
                  {catalog.map(c => (
                    <button key={c.key}
                            className={`canon ${canonKey === c.key ? "selected" : ""}`}
                            onClick={() => setCanonKey(c.key)}>
                      <img src={c.image_url} alt={c.title} />
                      <div className="label">{c.title}</div>
                    </button>
                  ))}
                </div>
                <button className="btn primary" disabled={!canonKey || busy} onClick={onSaveCanon}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* styles */}
      <style jsx>{`
        .container { max-width: 980px; margin: 0 auto; padding: 24px; }
        .title { text-align: center; margin-bottom: 12px; }
        .btn { padding: 10px 16px; border-radius: 10px; background:#2b6bff; color:#fff; border:0; }
        .btn.danger { background:#e24; }
        .current { display:grid; gap:24px; grid-template-columns: 1fr; margin-top: 24px; }
        .card { display:flex; flex-direction:column; align-items:center; gap:8px; }
        .card img { width: 360px; max-width: 100%; border-radius: 14px; display:block; }
        .modal { position: fixed; top:50%; left:50%; transform: translate(-50%, -50%); width: min(980px, 95vw);
                 background:#fff; border-radius: 16px; box-shadow: 0 20px 80px rgba(0,0,0,.25); padding: 16px; z-index: 60; }
        .backdrop { position: fixed; inset:0; background: rgba(0,0,0,.45); z-index: 50; }
        .modal-head { display:flex; justify-content:space-between; align-items:center; }
        .icon { border:0; background:#eee; border-radius: 8px; padding: 6px 10px; }
        .modes { display:flex; gap:12px; justify-content:center; margin: 12px 0; }
        .tab { background:#79b; color:#fff; border:0; border-radius:10px; padding:10px 12px; opacity: .6; }
        .tab.active { opacity: 1; box-shadow: 0 4px 0 #6aa; }
        .input, .textarea { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #d0d5e0; margin:8px 0; }
        .textarea { min-height: 90px; resize: vertical; }
        .panel { display:flex; flex-direction:column; gap:12px; align-items:center; }
        .preview { width: 320px; max-width: 100%; border-radius: 12px; }
        .grid { display:grid; gap:18px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); width:100%; }
        .canon { background:#eaf1ff; border:2px solid transparent; border-radius: 16px; padding:8px; }
        .canon.selected { border-color:#2b6bff; }
        .canon img { width:100%; border-radius: 12px; display:block; }
        .label { text-align:center; padding:8px 0 2px; font-weight:600; }
        .error { color:#b00; margin:0; }
        @media (min-width: 860px) {
          .current { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
