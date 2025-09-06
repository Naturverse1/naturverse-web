import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import { saveActive, loadActive } from "../../lib/navatar/storage";
import { Navatar } from "../../lib/navatar/types";
import "../../styles/navatar.css";

export default function GenerateNavatarPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState("");
  const [name, setName] = React.useState("");
  const [preview, setPreview] = React.useState<Navatar | null>(loadActive<Navatar>());

  // Placeholder: until AI gen is ready, just saves a text-only card
  function save() {
    const n: Navatar = {
      id: crypto.randomUUID(),
      name: name || "My Navatar",
      createdAt: Date.now(),
      base: "Spirit",
      imageDataUrl: preview?.imageDataUrl,
      imageUrl: preview?.imageUrl,
    };
    saveActive(n);
    alert("Saved ✓");
    navigate("/navatar");
  }

  return (
    <main className="nv-wrap">
      <h1 className="nv-title">Describe & Generate</h1>
      <Breadcrumbs items={[{ href: "/", label:"Home" }, { href: "/navatar", label:"Navatar" }, { label:"Describe & Generate" }]} />
      <NavatarTabs />

      <section className="nv-cols">
        <div className="nv-form">
          <label className="field">
            <span>Describe your Navatar (e.g., “leaf spirit with bamboo crown”)</span>
            <textarea rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} />
          </label>
          <label className="field">
            <span>Name (optional)</span>
            <input value={name} onChange={e=>setName(e.target.value)} />
          </label>
          <button className="btn" onClick={save}>Save</button>
        </div>
        <div className="nv-preview">
          <CharacterCard n={preview} />
        </div>
      </section>
    </main>
  );
}
