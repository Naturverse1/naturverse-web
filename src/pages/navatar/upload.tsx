import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { saveActive } from "../../lib/navatar/storage";
import "../../styles/navatar.css";

export default function UploadNavatarPage() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      saveActive({
        id: crypto.randomUUID(),
        name,
        imageDataUrl: String(reader.result),
        createdAt: Date.now(),
        base: "—"
      });
      alert("Uploaded ✓");
      navigate("/navatar");
    };
    reader.readAsDataURL(f);
  }

  return (
    <main className="nv-wrap">
      <h1 className="nv-title">Upload a Navatar</h1>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label:"Navatar" }, { label:"Upload" }]} />
      <NavatarTabs />
      <section className="nv-pane">
        <label className="field">
          <span>Choose file</span>
          <input type="file" accept="image/*" onChange={onUpload} />
        </label>
        <label className="field">
          <span>Name (optional)</span>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <button className="btn" onClick={()=>{ /* no-op; save happens on file select */ }}>Save</button>
      </section>
    </main>
  );
}
