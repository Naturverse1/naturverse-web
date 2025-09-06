import { useState } from "react";
import { saveMyCharacterCard } from "../../lib/navatar";
import { loadActiveNavatar } from "../../lib/localNavatar";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function CharacterCardPage() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState<string>("");
  const [traits, setTraits] = useState<string>("");

  async function onSave() {
    const active = loadActiveNavatar();
    if (!active) {
      alert("Please pick or upload a Navatar first.");
      return;
    }
    try {
      await saveMyCharacterCard({
        avatar_id: active, // kept for clarity; will be overwritten in helper too
        name: name || null,
        species: species || null,
        kingdom: kingdom || null,
        backstory: backstory || null,
        powers: powers ? powers.split(",").map(s => s.trim()).filter(Boolean) : null,
        traits: traits ? traits.split(",").map(s => s.trim()).filter(Boolean) : null
      } as any);
      alert("Saved!");
    } catch (e: any) {
      alert(e.message || "Save failed");
    }
  }

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Character Card</h1>
      <div className="nv-hub-grid">
        <div className="nv-panel form-card">
          <label>
            Name
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label>
            Species
            <input value={species} onChange={e => setSpecies(e.target.value)} />
          </label>
          <label>
            Kingdom
            <input value={kingdom} onChange={e => setKingdom(e.target.value)} />
          </label>
          <label>
            Backstory
            <textarea rows={5} value={backstory} onChange={e => setBackstory(e.target.value)} />
          </label>
          <label>
            Powers (comma separated)
            <input value={powers} onChange={e => setPowers(e.target.value)} />
          </label>
          <label>
            Traits (comma separated)
            <input value={traits} onChange={e => setTraits(e.target.value)} />
          </label>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={onSave}>Save</button>
            <Link to="/navatar" className="btn" style={{ marginLeft: 8 }}>Back to My Navatar</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
