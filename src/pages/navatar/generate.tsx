import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { saveActive } from "../../lib/localStorage";

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    let dataUrl = "";
    if (file) {
      dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(file);
      });
    }
    saveActive({ id: Date.now(), name, imageDataUrl: dataUrl, prompt, createdAt: Date.now() });
    alert("Saved ✓");
    nav("/navatar");
  }

  return (
    <main className="container">
      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Describe & Generate" }]}
      />
      <h1 className="center">Describe &amp; Generate</h1>
      <NavatarTabs active="generate" />
      <form onSubmit={onSave} className="center" style={{ maxWidth: 520, margin: "16px auto" }}>
        <textarea
          rows={4}
          placeholder="Describe your Navatar (e.g., friendly water-buffalo spirit)…"
          style={{ width: "100%" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          style={{ display: "block", width: "100%", margin: "8px 0" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }}>
          Save
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        AI art & edit coming soon.
      </p>
    </main>
  );
}

