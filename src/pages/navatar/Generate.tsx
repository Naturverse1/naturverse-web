import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uid, saveActive, loadLibrary, saveLibrary } from "../../lib/navatar/local";
import type { Navatar } from "../../types/navatar";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function save(e: React.FormEvent) {
    e.preventDefault();
    const nav: Navatar = {
      id: uid(),
      name: name || "My Navatar",
      backstory: prompt,
      imageUrl: undefined,
      createdAt: Date.now()
    };
    saveActive(nav);
    const lib = loadLibrary<Navatar>();
    saveLibrary([nav, ...lib].slice(0, 50));
    navigate("/navatar");
  }

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Describe &amp; Generate</span>
      </nav>
      <h2 className="nv-h2">Describe &amp; Generate</h2>

      <form className="nv-form" onSubmit={save}>
        <textarea className="nv-input" rows={5}
          placeholder="Describe your Navatar (e.g., leaf spirit with bamboo crown)…"
          value={prompt} onChange={e => setPrompt(e.target.value)} />
        <input className="nv-input" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button className="nv-btn-blue" type="submit">Save</button>
      </form>
    </section>
  );
}
