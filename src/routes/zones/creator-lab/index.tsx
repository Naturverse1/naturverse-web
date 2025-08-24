import React, { useMemo, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { CharacterCard, CardData } from "../../../components/CharacterCard";
import "../../../styles/zone-widgets.css";

const STORAGE_KEY = "naturverse.creatorLab.cards";

const blank: CardData = {
  id: "",
  name: "",
  realm: "",
  species: "",
  emoji: "🎴",
  color: "#c7f9cc",
  power: "",
  motto: "",
  avatarDataUrl: undefined,
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function loadCards(): CardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CardData[]) : [];
  } catch {
    return [];
  }
}
function saveCards(list: CardData[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

export default function CreatorLab() {
  const [cards, setCards] = useState<CardData[]>(loadCards());
  const [tab, setTab] = useState<"build"|"gallery"|"stickers"|"coming">("build");
  const [form, setForm] = useState<CardData>({ ...blank, id: uid() });

  const formValid = useMemo(
    () => form.name.trim().length > 0,
    [form.name]
  );

  const onFile = (f?: File) => {
    if (!f) return setForm(p => ({ ...p, avatarDataUrl: undefined }));
    const reader = new FileReader();
    reader.onload = () =>
      setForm(p => ({ ...p, avatarDataUrl: String(reader.result || "") }));
    reader.readAsDataURL(f);
  };

  const addCard = () => {
    if (!formValid) return;
    const next = [{ ...form }, ...cards];
    setCards(next);
    saveCards(next);
    setForm({ ...blank, id: uid() });
  };

  const removeCard = (id: string) => {
    const next = cards.filter(c => c.id !== id);
    setCards(next);
    saveCards(next);
  };

  return (
    <div>
      <Breadcrumbs />
      <h1>🎨🤖 Creator Lab</h1>
      <p>AI art &amp; character cards (client-only tools for now).</p>

      <div className="tabs" role="tablist" aria-label="Creator Lab">
        <button className="tab" aria-selected={tab==="build"} onClick={()=>setTab("build")}>Card Builder</button>
        <button className="tab" aria-selected={tab==="gallery"} onClick={()=>setTab("gallery")}>My Gallery <span className="badge">{cards.length}</span></button>
        <button className="tab" aria-selected={tab==="stickers"} onClick={()=>setTab("stickers")}>Sticker Sheet</button>
        <button className="tab" aria-selected={tab==="coming"} onClick={()=>setTab("coming")}>Coming Soon</button>
      </div>

      {tab === "build" && (
        <div className="clab-grid">
          {/* Builder form */}
          <section>
            <h2>Build a card</h2>
            <div className="form-row">
              <input className="input" placeholder="Name" value={form.name}
                     onChange={e=>setForm({...form, name:e.target.value})}/>
              <input className="input" placeholder="Realm (e.g., Amazonia)"
                     value={form.realm} onChange={e=>setForm({...form, realm:e.target.value})}/>
            </div>
            <div className="form-row">
              <input className="input" placeholder="Species (e.g., Macaw)"
                     value={form.species} onChange={e=>setForm({...form, species:e.target.value})}/>
            </div>
            <div className="form-row">
              <input className="input small" placeholder="Emoji" value={form.emoji}
                     onChange={e=>setForm({...form, emoji:e.target.value})} />
              <input className="input small" type="color" value={form.color}
                     onChange={e=>setForm({...form, color:e.target.value})}/>
              <label className="input small" style={{display:"inline-flex", alignItems:"center", gap:8}}>
                <span>Avatar</span>
                <input type="file" accept="image/*" onChange={e=>onFile(e.target.files?.[0])}/>
              </label>
            </div>
            <div className="form-row">
              <input className="input" placeholder="Power (e.g., River Songcraft)"
                     value={form.power} onChange={e=>setForm({...form, power:e.target.value})}/>
            </div>
            <div className="form-row">
              <input className="input" placeholder="Motto (short quote)"
                     value={form.motto} onChange={e=>setForm({...form, motto:e.target.value})}/>
            </div>

            <div className="actions">
              <button className="btn" onClick={addCard} disabled={!formValid} title={formValid ? "Save to gallery" : "Enter a name first"}>
                Save to Gallery
              </button>
              <button className="btn outline" onClick={()=>setForm({ ...blank, id: uid() })}>Reset</button>
            </div>

            <p className="meta">Cards are stored in your browser (localStorage) and never leave your device.</p>
          </section>

          {/* Live preview */}
          <section>
            <h2>Preview</h2>
            <CharacterCard data={form}/>
          </section>
        </div>
      )}

      {tab === "gallery" && (
        <section>
          <h2>My Gallery</h2>
          {cards.length === 0 && <p>No cards yet. Build one in the tab above.</p>}
          <div className="list-grid">
            {cards.map(c=>(
              <div className="card-mini" key={c.id}>
                <CharacterCard data={c}/>
                <div className="actions" style={{marginTop:10}}>
                  <button className="btn outline" onClick={()=>navigator.clipboard.writeText(JSON.stringify(c,null,2))}>Copy JSON</button>
                  <button className="btn outline" onClick={()=>removeCard(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "stickers" && (
        <section>
          <h2>Sticker Sheet</h2>
          <p className="meta">Print this page to get a simple sticker sheet of your cards.</p>
          <div className="list-grid">
            {cards.map(c=>(
              <div key={c.id} className="card-mini" style={{textAlign:"center"}}>
                <div style={{fontSize:32, marginBottom:6}}>{c.emoji || "🌱"}</div>
                <div style={{fontWeight:700}}>{c.name}</div>
                <div className="meta">{c.species} • {c.realm}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "coming" && (
        <section>
          <h2>Coming Soon</h2>
          <ul>
            <li>AI art generator for avatars.</li>
            <li>Prompt presets per world.</li>
            <li>Share cards to Passport & earn stamps.</li>
          </ul>
        </section>
      )}
    </div>
  );
}

