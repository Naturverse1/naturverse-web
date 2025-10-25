import React, { useMemo, useRef, useState } from "react";
import { uploadNavatarImage, createUploadRecord } from "@/lib/navatar";

type Props = {
  userId: string;
  onCreated: (avatar: any) => void;
  onClose: () => void;
  canonList: { id: string; name: string; image_url: string }[];
};

type Mode = "upload" | "ai" | "canon";

export default function NavatarModal({ userId, onCreated, onClose, canonList }: Props) {
  const [mode, setMode] = useState<Mode>("upload");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [canon, setCanon] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    if (mode === "upload") return !!file;
    if (mode === "ai") return prompt.trim().length > 0;
    if (mode === "canon") return !!canon;
    return false;
  }, [mode, file, prompt, canon]);

  async function onSave() {
    try {
      setSaving(true);

      if (mode === "upload" && file) {
        const url = await uploadNavatarImage(userId, file);
        const row = await createUploadRecord(userId, name || null, url);
        onCreated(row);
        onClose();
        return;
      }

      if (mode === "ai") {
        const res = await fetch("/.netlify/functions/create-navatar", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId, name, prompt })
        });

        const text = await res.text(); // robust against empty responses
        const data = text ? JSON.parse(text) : null;

        if (!res.ok) throw new Error(data?.error || "Failed to generate");
        onCreated(data.avatar);
        onClose();
        return;
      }

      if (mode === "canon" && canon) {
        // canon is just a pre-existing asset; save URL + method=canon
        const res = await fetch("/api/navatar/save-canon", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ userId, name, imageUrl: canon })
        });
        if (!res.ok) throw new Error("Failed to save canon");
        const row = await res.json();
        onCreated(row);
        onClose();
        return;
      }
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nv-modal">
      <div className="nv-card">
        <div className="nv-head">
          <h3>Create Navatar</h3>
          <button className="nv-x" onClick={onClose}>×</button>
        </div>

        <div className="nv-tabs">
          <button className={`nv-tab ${mode==='upload'?'active':''}`} onClick={()=>setMode("upload")}>Upload</button>
          <button className={`nv-tab ${mode==='ai'?'active':''}`} onClick={()=>setMode("ai")}>Describe & Generate</button>
          <button className={`nv-tab ${mode==='canon'?'active':''}`} onClick={()=>setMode("canon")}>Pick Canon</button>
        </div>

        <input
          className="nv-input"
          placeholder="Name (optional)"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        {mode === "upload" && (
          <div className="nv-body">
            <input
              type="file"
              accept="image/*"
              onChange={(e)=>setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <img
                className="nv-preview"
                src={URL.createObjectURL(file)}
                alt="preview"
              />
            )}
          </div>
        )}

        {mode === "ai" && (
          <div className="nv-body">
            <textarea
              className="nv-textarea"
              placeholder="e.g., joyful turtle wearing sunglasses, watercolor"
              value={prompt}
              onChange={(e)=>setPrompt(e.target.value)}
            />
            <p className="nv-hint">
              If your OpenAI org/project isn’t set for images, you’ll see a clear error.
            </p>
          </div>
        )}

        {mode === "canon" && (
          <div className="nv-body">
            <div className="nv-canon-grid">
              {canonList.map(c => (
                <button
                  key={c.id}
                  className={`nv-canon-card ${canon===c.image_url?'sel':''}`}
                  onClick={()=>setCanon(c.image_url)}
                >
                  <img src={c.image_url} alt={c.name}/>
                  <div className="nv-canon-name">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="nv-foot">
          <button
            className="nv-save"
            disabled={!canSave || saving}
            onClick={onSave}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .nv-modal{
          position:fixed; inset:0; background:rgba(0,0,0,.45);
          display:flex; align-items:center; justify-content:center; z-index:1000;
        }
        .nv-card{ width:min(900px,92vw); background:#fff; border-radius:14px; box-shadow:0 10px 30px rgba(0,0,0,.2); }
        .nv-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid #eee; }
        .nv-x{ border:none; background:#eef; width:32px; height:32px; border-radius:8px; cursor:pointer; }
        .nv-tabs{ display:flex; gap:10px; padding:12px 16px; }
        .nv-tab{ padding:10px 14px; border-radius:10px; border:1px solid #dbe; background:#f7f9ff; cursor:pointer; }
        .nv-tab.active{ background:#2673ff; color:#fff; border-color:#2673ff; }
        .nv-input{ margin:0 16px 12px; width:calc(100% - 32px); padding:10px 12px; border:1px solid #ddd; border-radius:10px; }
        .nv-body{ padding:0 16px 16px; }
        .nv-textarea{ width:100%; min-height:120px; padding:12px; border:1px solid #ddd; border-radius:10px; }
        .nv-hint{ color:#888; font-size:12px; margin-top:8px; }
        .nv-preview{ width:280px; border-radius:12px; margin-top:12px; }
        .nv-canon-grid{
          display:grid; grid-template-columns:repeat(auto-fill, minmax(160px,1fr));
          gap:14px; max-height:50vh; overflow-y:auto; padding-bottom:8px;
        }
        .nv-canon-card{ text-align:center; border:2px solid transparent; border-radius:14px; padding:8px; background:#f8fafc; }
        .nv-canon-card.sel{ border-color:#2673ff; box-shadow:0 0 0 4px rgba(38,115,255,.15); }
        .nv-canon-card img{ width:100%; height:220px; object-fit:cover; border-radius:10px; }
        .nv-canon-name{ margin-top:6px; font-weight:600; }
        .nv-foot{
          padding:12px 16px; border-top:1px solid #eee; display:flex; justify-content:flex-end;
          position:sticky; bottom:0; background:#fff; border-radius:0 0 14px 14px;
        }
        .nv-save{ background:#2673ff; color:#fff; border:none; padding:10px 16px; border-radius:10px; }
        .nv-save:disabled{ opacity:.5; }
      `}</style>
    </div>
  );
}
