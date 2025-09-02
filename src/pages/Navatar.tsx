import { useEffect, useMemo, useState } from "react";
import { supa, uploadToNavatars } from "../lib/supa";
import catalog from "/public/navatars/catalog.json";
import "./Navatar.css";

type Avatar = {
  id: string;
  name: string | null;
  method: "canon" | "upload" | "ai";
  image_url: string | null;
  storage_path: string | null;
};

type Mode = "upload" | "ai" | "canon";

export default function NavatarPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("upload");
  const [busy, setBusy] = useState(false);

  // form
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [canon, setCanon] = useState<string | null>(null);

  const userId = useMemo(() => window.localStorage.getItem("uid") || "demo", []);

  async function load() {
    const { data } = await supa.from("avatars").select("*").order("created_at", { ascending: false });
    setAvatars((data as Avatar[]) || []);
  }

  useEffect(() => { load(); }, []);

  async function onSaveUpload() {
    if (!file) return;
    setBusy(true);
    try {
      const { publicUrl, path } = await uploadToNavatars(file, userId);
      const { error } = await supa.from("avatars").insert({
        user_id: userId, name: name || file.name, method: "upload",
        image_url: publicUrl, storage_path: path
      });
      if (error) throw error;
      reset();
      await load();
    } finally { setBusy(false); }
  }

  async function onSaveCanon() {
    if (!canon) return;
    setBusy(true);
    try {
      const item = (catalog as any[]).find(c => c.slug === canon);
      const { error } = await supa.from("avatars").insert({
        user_id: userId, name: item.title, method: "canon",
        image_url: item.src, storage_path: null
      });
      if (error) throw error;
      reset();
      await load();
    } finally { setBusy(false); }
  }

  async function onGenerate() {
    setBusy(true);
    try {
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, prompt })
      });
      if (res.status === 403) {
        alert("AI image generation is disabled for this org (OpenAI 403).");
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      reset();
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed to generate");
    } finally { setBusy(false); }
  }

  function reset() {
    setOpen(false); setMode("upload");
    setName(""); setFile(null); setPrompt(""); setCanon(null);
  }

  return (
    <div className="page">
      <h1>Your Navatar</h1>
      <button onClick={() => setOpen(true)} className="primary">Create Navatar</button>

      <section className="grid">
        {avatars.map(a => (
          <article key={a.id} className="card">
            {a.image_url ? <img src={a.image_url} alt={a.name || "avatar"} /> : <div className="ph" />}
            <div className="meta">
              <div className="name">{a.name || "avatar"}</div>
              <div className="pill">{a.method.toUpperCase()}</div>
              <button className="danger" onClick={async () => {
                if (!confirm("Delete this navatar?")) return;
                await supa.from("avatars").delete().eq("id", a.id);
                await load();
              }}>Delete</button>
            </div>
          </article>
        ))}
      </section>

      {open && (
        <div className="modal">
          <div className="panel">
            <button className="close" onClick={() => setOpen(false)}>×</button>
            <h2>Create Navatar</h2>

            {/* Single-select tabs */}
            <div className="tabs">
              <button className={mode==='upload'?'active':''} onClick={() => setMode("upload")}>Upload</button>
              <button className={mode==='ai'?'active':''} onClick={() => setMode("ai")}>Describe & Generate</button>
              <button className={mode==='canon'?'active':''} onClick={() => setMode("canon")}>Pick Canon</button>
            </div>

            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (optional)" />

            {mode === "upload" && (
              <>
                <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
                {file && <img className="preview" src={URL.createObjectURL(file)} alt="preview" />}
                <button disabled={!file || busy} onClick={onSaveUpload} className="primary">Save</button>
              </>
            )}

            {mode === "ai" && (
              <>
                <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Funny turtle" />
                <p className="hint">If your OpenAI org is not verified for images, you’ll see a 403 notice; upload or pick canon instead.</p>
                <button disabled={!prompt || busy} onClick={onGenerate} className="primary">Generate</button>
              </>
            )}

            {mode === "canon" && (
              <>
                <div className="canon-grid">
                  {(catalog as any[]).map(item => (
                    <label key={item.slug} className={"canon-card " + (canon===item.slug?"selected":"")}>
                      <input type="radio" name="canon" value={item.slug}
                             onChange={()=>setCanon(item.slug)} checked={canon===item.slug} />
                      <img src={item.src} alt={item.title} />
                      <div className="title">{item.title}</div>
                    </label>
                  ))}
                </div>
                <button disabled={!canon || busy} onClick={onSaveCanon} className="primary">Save</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
