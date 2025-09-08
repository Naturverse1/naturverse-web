import React, { useState } from "react";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Choose an image first.");
      return;
    }
    setBusy(true);
    try {
      await uploadNavatar(file, name.trim() || undefined);
      alert("Uploaded and set as active!");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Upload</h1>
      <NavatarTabs />

      <form className="form" style={{ maxWidth: 680 }} onSubmit={onSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label className="label" style={{ marginTop: 12 }}>
          Name (optional)
        </label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginTop: 16 }}>
          <button className="btn" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
