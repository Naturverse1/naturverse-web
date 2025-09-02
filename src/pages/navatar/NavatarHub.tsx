import { useEffect, useMemo, useState } from "react";
import { supabase, publicAvatarUrl } from "../../lib/supabase";
import type { NavatarRow, NavatarMethod } from "../../types/navatar";
import canon from "../../data/navatar-canon.json";
import "../../styles/navatar.css";

type Tab = "upload" | "ai" | "canon";

export default function NavatarHub() {
  const [rows, setRows] = useState<NavatarRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("upload");

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [canonKey, setCanonKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("avatars")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setRows((data as any) ?? []);
      setLoading(false);
    })();
  }, []);

  const resetForm = () => {
    setName("");
    setFile(null);
    setPrompt("");
    setCanonKey(null);
    setError(null);
    setBusy(false);
    setTab("upload");
  };

  const close = () => {
    setOpen(false);
    resetForm();
  };

  async function handleSave() {
    try {
      setBusy(true);
      setError(null);

      let method: NavatarMethod;
      let storage_path: string | null = null;
      let canon_key: string | null = null;

      if (tab === "canon") {
        if (!canonKey) throw new Error("Pick a canon first");
        method = "canon";
        canon_key = canonKey;
      } else if (tab === "upload") {
        if (!file) throw new Error("Choose a file first");
        method = "upload";
        const ext = file.name.split(".").pop() || "png";
        const path = `u/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
          upsert: false,
          cacheControl: "3600",
        });
        if (upErr) throw upErr;
        storage_path = path;
      } else {
        method = "ai";
        const resp = await fetch("/.netlify/functions/create-navatar", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: name || "Navatar", prompt }),
        });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json?.error || "Failed to generate");

        const bin = Uint8Array.from(atob(json.b64), (c) => c.charCodeAt(0));
        const path = `ai/${crypto.randomUUID()}.png`;
        const { error: upErr } = await supabase.storage.from("avatars").upload(path, bin, {
          contentType: json.mime || "image/png",
        });
        if (upErr) throw upErr;
        storage_path = path;
      }

      const { data, error: insErr } = await supabase
        .from("avatars")
        .insert({
          name: name || null,
          method,
          storage_path,
          canon_key,
        })
        .select()
        .single();

      if (insErr) throw insErr;
      setRows((prev) => [data as any, ...prev]);
      close();
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const renderImage = (r: NavatarRow) => {
    if (r.method === "canon") {
      const c = (canon as any[]).find((x) => x.key === r.canon_key);
      return c ? <img src={c.src} alt={c.name} /> : <div className="hint">missing canon</div>;
    }
    if (r.storage_path) {
      return <img src={publicAvatarUrl(r.storage_path)} alt={r.name || "Navatar"} />;
    }
    return <div className="hint">no image</div>;
  };

  const selectedCanon = useMemo(
    () => (canon as any[]).find((x) => x.key === canonKey) || null,
    [canonKey]
  );

  return (
    <div className="navatar-wrap">
      <h1>Your Navatar</h1>

      <div className="navatar-toolbar">
        <button className="navatar-primary" onClick={() => setOpen(true)}>
          Create Navatar
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="navatar-list">
          {rows.map((r) => (
            <div className="navatar-card" key={r.id}>
              {renderImage(r)}
              <div style={{ padding: "8px 2px" }}>
                <div style={{ fontWeight: 700 }}>{r.name || "(unnamed)"}</div>
                <div className="hint" style={{ textTransform: "uppercase" }}>
                  {r.method}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="tabs">
              <button className={`tab ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
                Upload
              </button>
              <button className={`tab ${tab === "ai" ? "active" : ""}`} onClick={() => setTab("ai")}>
                Describe & Generate
              </button>
              <button className={`tab ${tab === "canon" ? "active" : ""}`} onClick={() => setTab("canon")}>
                Pick Canon
              </button>
              <button className="close" onClick={close}>✕</button>
            </div>

            <div style={{ padding: 8 }}>
              <input
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginBottom: 12, padding: 10 }}
              />

              {tab === "upload" && (
                <>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  {file && (
                    <img
                      className="preview-img"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                  )}
                </>
              )}

              {tab === "ai" && (
                <>
                  <textarea
                    rows={5}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your navatar..."
                    style={{ width: "100%", padding: 10 }}
                  />
                  <div className="hint" style={{ marginTop: 6 }}>
                    If your OpenAI project isn’t verified for images, you’ll get a clear error here.
                  </div>
                </>
              )}

              {tab === "canon" && (
                <div className="canon-grid">
                  {(canon as any[]).map((c) => (
                    <div
                      key={c.key}
                      className="canon-card"
                      style={{ outline: c.key === canonKey ? "3px solid #1b64ff" : "none" }}
                      onClick={() => setCanonKey(c.key)}
                    >
                      <img src={c.src} alt={c.name} />
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{ color: "crimson", padding: "6px 10px" }}>{error}</div>
            )}

            <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
              <button disabled={busy} className="navatar-primary" onClick={handleSave}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
