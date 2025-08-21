import React, { useMemo, useState } from "react";
import { SPECIES, generate } from "../lib/navatar/generator";
import type { Base, Navatar } from "../lib/navatar/types";
import { getCurrent, setCurrent, saveToLibrary, list } from "../lib/navatar/store";
import NavatarCard from "../components/NavatarCard";

const BASES: Base[] = ["Animal", "Fruit", "Insect", "Spirit"];

export default function NavatarPage() {
  const [base, setBase] = useState<Base>("Animal");
  const [species, setSpecies] = useState<string>(SPECIES["Animal"][0].name);
  const [nav, setNav] = useState<Navatar>(() => getCurrent() ?? generate("Animal", SPECIES["Animal"][0].name));
  const [photo, setPhoto] = useState<string | undefined>(nav.photo);
  const [name, setName] = useState(nav.name);
  const [power, setPower] = useState(nav.power);
  const [backstory, setBackstory] = useState(nav.backstory);

  const options = useMemo(() => SPECIES[base].map(s => s.name), [base]);

  const regen = () => {
    const n = generate(base, species);
    n.photo = photo;
    setNav(n);
    setName(n.name); setPower(n.power); setBackstory(n.backstory);
  };

  const onUpload = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = e => { const url = String(e.target?.result || ""); setPhoto(url); setNav({ ...nav, photo: url }); };
    reader.readAsDataURL(f);
  };

  const save = () => {
    const n: Navatar = { ...nav, name, power, backstory, photo };
    setCurrent(n);
    saveToLibrary(n);
    alert("Saved! Your Navatar is now set across the site (stored locally).");
  };

  return (
    <div>
      <h1>Navatar Creator</h1>
      <p>Choose a base type, tune details, and generate a character card. Upload a photo to morph into your Navatar (visual only, no AI yet).</p>

      {/* Builder */}
      <div className="panel">
        <div className="row wrap gap">
          <div className="stack">
            <div className="muted">Base</div>
            <div className="pill-row">
              {BASES.map(b => (
                <button key={b}
                        className={"pill-btn" + (base === b ? " active" : "")}
                        onClick={() => { setBase(b); setSpecies(SPECIES[b][0].name); }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="stack">
            <div className="muted">Species</div>
            <select className="input" value={species} onChange={e => setSpecies(e.target.value)}>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="stack">
            <div className="muted">Photo (optional)</div>
            <input className="input" type="file" accept="image/*" onChange={e => onUpload(e.target.files?.[0] || null)} />
            {photo && <img src={photo} alt="preview" className="navatar-photo" />}
          </div>

          <div className="stack">
            <div className="muted">Name</div>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="stack">
            <div className="muted">Power</div>
            <input className="input" value={power} onChange={e => setPower(e.target.value)} />
          </div>

          <div className="stack grow">
            <div className="muted">Backstory</div>
            <textarea className="input" rows={3} value={backstory} onChange={e => setBackstory(e.target.value)} />
          </div>

          <div className="stack">
            <div className="muted">&nbsp;</div>
            <div className="row gap">
              <button className="btn" onClick={regen}>Regenerate</button>
              <button className="btn outline" onClick={save}>Save Navatar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <NavatarCard n={{ ...nav, name, power, backstory, photo }} />

      {/* Library */}
      <h2 className="mt">Your Navatars</h2>
      <div className="hub-grid">
        {list().map(x => (
          <div key={x.id} className="hub-card">
            <div className="emoji">{x.emoji}</div>
            <div className="title">{x.name}</div>
            <div className="desc">{x.base} · {x.species}</div>
            <button className="btn tiny" onClick={() => { setCurrent(x); setNav(x); setName(x.name); setPower(x.power); setBackstory(x.backstory); setPhoto(x.photo); }}>
              Set Active
            </button>
          </div>
        ))}
      </div>

      <p className="meta">Coming soon: AI-assisted art, upgrade market, and cross-app avatar usage.</p>
    </div>
  );
}
