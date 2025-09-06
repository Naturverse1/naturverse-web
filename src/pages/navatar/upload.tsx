import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { saveActive } from "../../lib/localStorage";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const dataUrl = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
    saveActive({ id: Date.now(), name, imageDataUrl: dataUrl, createdAt: Date.now() });
    alert("Uploaded ✓");
    nav("/navatar");
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      <h1 className="center">Upload a Navatar</h1>
      <NavatarTabs active="upload" />
      <form onSubmit={onSave} className="center" style={{ maxWidth: 480, margin: "16px auto" }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input
          style={{ display: "block", width: "100%", margin: "8px 0" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="pill pill--active" type="submit">
          Save
        </button>
      </form>
    </main>
  );
}

