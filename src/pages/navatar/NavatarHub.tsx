import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Avatar = {
  id: string;
  name: string;
  method: "canon" | "upload" | "ai";
  image_url: string | null;
};

type Mode = "idle" | "upload" | "generate" | "canon";

export default function NavatarHub({ user }: { user: { id: string } }) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [name, setName] = useState("");

  // Generate state
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const userId = user.id;

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("avatars")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setAvatars(data as any);
    })();
  }, []);

  function open(mode: Mode) {
    setModalOpen(true);
    setMode(mode);
  }

  function close() {
    setModalOpen(false);
    setMode("idle");
    setUploadFile(null);
    setUploadPreview(null);
    setPrompt("");
    setName("");
  }

  async function saveUpload() {
    if (!uploadFile) return;
    setBusy(true);
    try {
      const id = crypto.randomUUID();
      const path = `${userId}/${id}-${uploadFile.name}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, uploadFile, { upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const image_url = pub?.publicUrl;

      const { error: dbErr } = await supabase.from("avatars").insert({
        id,
        user_id: userId,
        name: name || uploadFile.name.replace(/\.[^.]+$/, ""),
        method: "upload",
        image_url,
      });
      if (dbErr) throw dbErr;

      await refresh();
      close();
    } catch (e) {
      alert((e as any).message ?? "Failed to save upload");
    } finally {
      setBusy(false);
    }
  }

  async function generate() {
    if (!prompt.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/.netlify/functions/create-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: name.trim(), prompt }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to generate");

      await refresh();
      close();
    } catch (e) {
      alert((e as any).message ?? "Failed to generate");
    } finally {
      setBusy(false);
    }
  }

  async function pickCanon(canon: { name: string; image_url: string }) {
    setBusy(true);
    try {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("avatars").insert({
        id,
        user_id: userId,
        name: canon.name,
        method: "canon",
        image_url: canon.image_url,
      });
      if (error) throw error;
      await refresh();
      close();
    } catch (e) {
      alert((e as any).message ?? "Failed to save canon");
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    const { data } = await supabase
      .from("avatars")
      .select("*")
      .order("created_at", { ascending: false });
    setAvatars((data || []) as any);
  }

  return (
    <div className="container">
      <h1>Your Navatar</h1>
      <button onClick={() => open("upload")}>Create Navatar</button>

      {/* Avatars */}
      <div className="grid">
        {avatars.map((a) => (
          <div key={a.id} className="card">
            {a.image_url ? (
              <img src={a.image_url} alt={a.name} />
            ) : (
              <div className="ph" />
            )}
            <div className="meta">
              <strong>{a.name}</strong>
              <small>{a.method.toUpperCase()}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modalOverlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="tabs">
              <button
                className={mode === "upload" ? "active" : ""}
                onClick={() => setMode("upload")}
              >
                Upload
              </button>
              <button
                className={mode === "generate" ? "active" : ""}
                onClick={() => setMode("generate")}
              >
                Describe & Generate
              </button>
              <button
                className={mode === "canon" ? "active" : ""}
                onClick={() => setMode("canon")}
              >
                Pick Canon
              </button>
              <button className="close" onClick={close}>✕</button>
            </div>

            <input
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {mode === "upload" && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setUploadFile(f);
                    setUploadPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
                {uploadPreview && <img className="preview" src={uploadPreview} />}
                <button disabled={busy || !uploadFile} onClick={saveUpload}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </>
            )}

            {mode === "generate" && (
              <>
                <textarea
                  placeholder="e.g., friendly turtle wearing headphones"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="hint">
                  If your OpenAI project isn’t verified for images, you’ll get a clear error here.
                </p>
                <button disabled={busy || !prompt.trim()} onClick={generate}>
                  {busy ? "Generating…" : "Generate"}
                </button>
              </>
            )}

            {mode === "canon" && (
              <div className="canonScroller">
                {CANON.map((c) => (
                  <button key={c.slug} className="canonCard" onClick={() => pickCanon(c)}>
                    <img src={c.image_url} alt={c.name} />
                    <div>{c.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }
        .card { background:#f6f7fb; border-radius:14px; padding:12px; }
        .card img { width:100%; border-radius:12px; display:block; }
        .modalOverlay { position:fixed; inset:0; background:rgba(0,0,0,.40); display:flex; align-items:center; justify-content:center; z-index:1000; }
        .modal { width:min(980px,95vw); max-height:90vh; overflow:auto; background:#fff; border-radius:16px; padding:16px; position:relative; }
        .tabs { display:flex; gap:10px; align-items:center; position:sticky; top:0; background:#fff; padding-bottom:8px; }
        .tabs button.active { background:#1b64ff; color:white; }
        .tabs .close { margin-left:auto; }
        .canonScroller { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; overflow:auto; max-height:60vh; padding:8px 0; }
        .canonCard { display:flex; flex-direction:column; gap:8px; background:#f4f6ff; border-radius:12px; padding:8px; }
        .canonCard img { height:220px; object-fit:cover; border-radius:8px; }
        .preview { width:320px; border-radius:12px; display:block; margin:12px 0; }
        .hint { font-size:12px; color:#6b7280; }
      `}</style>
    </div>
  );
}

const CANON = [
  { slug: "frankie-frogs", name: "Frankie Frogs", image_url: "/navatars/frankie-frogs.png" },
  { slug: "blu-butterfly", name: "Blu Butterfly", image_url: "/navatars/blu-butterfly.png" },
];
