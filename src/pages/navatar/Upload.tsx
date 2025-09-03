import { useState } from "react";
import Breadcrumbs from "../../components/NavBreadcrumbs";
import Button from "../../components/Button";
import CardImage from "../../components/CardImage";
import "../../styles/navatar.css";

export default function NavatarUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();
  const [preview, setPreview] = useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true); setErr(undefined);

    try {
      const body = new FormData();
      body.append("file", file);
      if (name) body.append("name", name);

      const r = await fetch("/api/navatar-upload", { method: "POST", body });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
      setPreview(data?.image_url);
      sessionStorage.setItem("navatar_url", data.image_url);
      sessionStorage.setItem("navatar_name", name || "Me");
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      <h1 className="nv-h1">Upload Navatar</h1>

      <div className="nv-col nv-row">
        <form onSubmit={onSubmit} className="nv-row">
          <input type="file" accept="image/*" className="nv-input" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input className="nv-input" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          {err && <div className="nv-tip" style={{ color: "#b91c1c", borderColor: "#fecaca", background: "#fff1f2" }}>{err}</div>}
          <Button type="submit" busy={busy} disabled={!file}>Upload</Button>
        </form>

        {preview && (
          <>
            <h2 className="nv-h1" style={{ fontSize: 28 }}>Your Navatar</h2>
            <CardImage src={preview} alt={name || "Navatar"} />
          </>
        )}
      </div>
    </div>
  );
}
