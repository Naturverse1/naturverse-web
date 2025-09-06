import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uid, saveActive, loadLibrary, saveLibrary } from "../../lib/navatar/local";
import type { Navatar } from "../../types/navatar";

export default function Upload() {
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const navigate = useNavigate();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFileUrl(String(reader.result));
    reader.readAsDataURL(f);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!fileUrl) { alert("Choose an image"); return; }
    const nav: Navatar = { id: uid(), name: name || "My Navatar", imageUrl: fileUrl, createdAt: Date.now() };
    saveActive(nav);
    const lib = loadLibrary<Navatar>();
    saveLibrary([nav, ...lib].slice(0, 50));
    alert("Uploaded ✓");
    navigate("/navatar");
  }

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Upload</span>
      </nav>
      <h2 className="nv-h2">Upload a Navatar</h2>

      <form className="nv-form" onSubmit={save}>
        <input type="file" accept="image/*" className="nv-input" onChange={onFile} />
        <input className="nv-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button className="nv-btn-blue" type="submit">Save</button>
      </form>
    </section>
  );
}
