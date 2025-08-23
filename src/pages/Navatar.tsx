import React, { useMemo, useState } from "react";
import type { Navatar, NavatarBase } from "../types/navatar";
import { SPECIES, POWERS_BANK, randomFrom } from "../lib/navatarCatalog";
import { loadActive, saveActive, loadLibrary, saveLibrary } from "../lib/localStorage";
import NavatarCard from "../components/NavatarCard";
import Meta from "../components/Meta";
import Breadcrumbs from "../components/Breadcrumbs";
import PageHead from "../components/PageHead";

const BASES: NavatarBase[] = ["Animal", "Fruit", "Insect", "Spirit"];

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function makeBackstory(base: NavatarBase, species: string) {
  return `Born in the ${base.toLowerCase()} realm, this ${species} learned to help explorers `
    + `by trading ${randomFrom(["songs","stories","maps","herb lore","riddles"])} for smiles. `
    + `Their quest: protect habitats and cheer on friends across the 14 kingdoms.`;
}

function generate(base: NavatarBase): Navatar {
  const species = randomFrom(SPECIES[base]);
  const powers = Array.from(new Set([
    randomFrom(POWERS_BANK),
    randomFrom(POWERS_BANK),
    randomFrom(POWERS_BANK),
  ]));
  return {
    id: makeId(),
    name: "",
    base,
    species,
    powers,
    backstory: makeBackstory(base, species),
    imageDataUrl: undefined,
    createdAt: Date.now(),
  };
}

export default function NavatarPage() {
  const initial = useMemo(() => loadActive<Navatar>() ?? generate("Animal"), []);
  const [draft, setDraft] = useState<Navatar>(initial);
  const [library, setLibrary] = useState<Navatar[]>(loadLibrary<Navatar>());

  function setBase(b: NavatarBase) {
    setDraft(generate(b));
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, imageDataUrl: String(reader.result) });
    reader.readAsDataURL(f);
  }

  function saveActiveAndLibrary() {
    const toSave = { ...draft, name: draft.name.trim() };
    saveActive(toSave);
    const nextLib = [toSave, ...library].slice(0, 50);
    setLibrary(nextLib);
    saveLibrary(nextLib);
    alert("Navatar saved locally!");
  }

  return (
    <div className="page-wrap">
      <PageHead title="Naturverse — Navatar Creator" description="Design your character and save cards." />
      <Meta title="Navatar Creator — Naturverse" description="Design your character and save cards." />
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Navatar" }]} />
      <main id="main" className="wrap">
        <h1>Navatar Creator</h1>
        <p>Choose a base type, customize details, and save your character card.</p>

      <div className="grid">
        <section className="panel">
          <h2>1) Pick a Base</h2>
          <div className="choices">
            {BASES.map(b => (
              <button
                key={b}
                type="button"
                className={`pill ${draft.base === b ? "pill--active" : ""}`}
                onClick={() => setBase(b)}
                aria-pressed={draft.base === b}
              >
                {b}
              </button>
            ))}
          </div>

          <h2>2) Details</h2>
          <label className="field">
            <span>Name (optional)</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder={`${draft.species}…`}
            />
          </label>

          <label className="field">
            <span>Backstory</span>
            <textarea
              value={draft.backstory}
              onChange={(e) => setDraft({ ...draft, backstory: e.target.value })}
              rows={4}
            />
          </label>

          <label className="field">
            <span>Photo (optional)</span>
            <input type="file" accept="image/*" onChange={onUpload} />
          </label>

          <div className="actions navatar-buttons">
            <button type="button" onClick={() => setDraft(generate(draft.base))}>
              Randomize
            </button>
            <button type="button" onClick={saveActiveAndLibrary}>
              Save Navatar
            </button>
          </div>
        </section>

        <section className="panel">
          <h2>Character Card</h2>
          <NavatarCard navatar={draft} />

          <h3 style={{marginTop:16}}>Library (local)</h3>
          {library.length === 0 && <p>No saved Navatars yet.</p>}
          <ul className="lib">
            {library.map(n => (
              <li key={n.id}>
                <button
                  type="button"
                  className="linklike"
                  onClick={() => setDraft(n)}
                >
                  {n.name || n.species} — {n.base}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="note">Coming soon: AI assisted art & powers, upgrade market, and cross-app use.</p>

      <style>{`
        .wrap{max-width:1100px;margin:0 auto}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        @media (max-width:900px){.grid{grid-template-columns:1fr}}
        .panel{background:#fff;border:1px solid #e6e6e6;border-radius:12px;padding:16px}
        .choices{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}
        .pill{border:1px solid #d0d0d0;background:#f8f8f8;border-radius:999px;padding:8px 12px}
        .pill--active{background:#e9f7ef;border-color:#9ad1b1}
        .field{display:flex;flex-direction:column;gap:6px;margin:10px 0}
        .field input,.field textarea{padding:10px;border:1px solid #dadada;border-radius:8px}
        .actions{display:flex;gap:10px;margin-top:10px}
        .lib{list-style:none;padding:0;margin:8px 0}
        .lib li{margin:4px 0}
        .linklike{background:none;border:none;padding:0;color:#0b62d6;cursor:pointer}
        .note{opacity:.75;margin-top:24px}
      `}</style>
      </main>
    </div>
    );
}
