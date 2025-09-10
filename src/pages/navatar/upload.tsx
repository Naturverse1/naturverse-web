import React, { useState } from "react";
import { supabase } from "../../lib/supabase-client";
import { uploadAvatarFile } from "../../lib/navatar";
import NavatarCard from "../../components/NavatarCard";
import "../../styles/navatar.css";

export default function NavatarUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in");
    if (!file) return alert("Choose a file first");
    setBusy(true);
    try {
      const row = await uploadAvatarFile(file, user.id, name.trim());
      alert("Upload complete");
      setPreview(row.image_url || undefined);
      setName(row.name ?? "");
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Upload Navatar</h1>

      <section className="nv-upload">
        <NavatarCard src={preview} title={name || "My Navatar"} />
        <div className="nv-upload__form">
          <input type="file" accept="image/*" onChange={onChange} />
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={onSave} disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </main>
  );
}

