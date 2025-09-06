import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { setCurrent } from "../../lib/navatar/store";

export default function NavatarUpload() {
  const [file, setFile] = React.useState<File | null>(null);
  const [name, setName] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Choose an image");
    const b64 = await fileToDataUrl(file);
    const nav = { id: "upload-" + Date.now(), name: name.trim() || "My Navatar", img: b64 };
    setCurrent(nav as any);
    alert("Uploaded ✓");
    window.location.href = "/navatar";
  }

  return (
    <main style={{ maxWidth: 800, margin:"0 auto", padding:"24px 16px" }}>
      <Breadcrumbs className="breadcrumbs--blue" items={[
        { label: "Home", href: "/" },
        { label: "Navatar", href: "/navatar" },
        { label: "Upload" },
      ]}/>
      <h1>Upload a Navatar</h1>
      <NavatarTabs />
      <form onSubmit={onSubmit} style={{ display:"grid", gap:12 }}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </main>
  );
}

function fileToDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}
