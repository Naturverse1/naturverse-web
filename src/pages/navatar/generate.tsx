import React, { useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { setCurrent } from "../../lib/navatar/store";

const STYLE_PRESETS = [
  "Leaf spirit with gentle smile, teal-blue palette",
  "Festival splash creature with water motif",
  "Zen panda minimal lines, calm expression",
  "Bamboo buddy, rounded shapes, friendly eyes",
];

export default function NavatarGenerate() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState<string[] | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [name, setName] = useState("");

  async function generate() {
    setBusy(true); setImages(null); setChoice(null);
    const r = await fetch("/.netlify/functions/navatar-generate", {
      method: "POST",
      body: JSON.stringify({ prompt: prompt.trim() || "leaf spirit mascot" }),
    });
    const data = await r.json();
    setImages(data.images || []);
    setBusy(false);
  }

  async function save() {
    if (choice == null || !images?.[choice]) return alert("Pick one preview");
    const id = `gen-${Date.now().toString(36)}`;
    const b64 = images[choice];
    const label = name.trim() || "My Navatar";

    // Save to backend (optional)
    await fetch("/.netlify/functions/navatar-save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: (window as any).user?.id, name: label, navatar_id: id, b64_png: b64 }),
    }).catch(() => {});

    setCurrent({ id, name: label, img: `data:image/png;base64,${b64}`, rarity:"Common", priceCents:0 });
    alert("Saved ✓");
    window.location.href = "/navatar";
  }

  return (
    <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 16px" }}>
      <Breadcrumbs className="breadcrumbs--blue" items={[
        { label: "Home", href: "/" },
        { label: "Navatar", href: "/navatar" },
        { label: "Generate" },
      ]}/>
      <h1>Generate a Navatar</h1>
      <NavatarTabs />

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"12px 0" }}>
        {STYLE_PRESETS.map((s) => (
          <button key={s} onClick={() => setPrompt(s)} className="btn">{s}</button>
        ))}
      </div>

      <textarea rows={3} placeholder="e.g., leaf spirit with bamboo crown and ocean aura"
        value={prompt} onChange={(e)=>setPrompt(e.target.value)}
        style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e5e7eb" }}/>
      <div style={{ marginTop:12 }}>
        <button className="btn btn-primary" onClick={generate} disabled={busy}>
          {busy ? "Generating…" : "Generate 4 previews"}
        </button>
      </div>

      {images && (
        <>
          <h2 style={{ marginTop:24 }}>Pick one</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
            {images.map((b64, i) => (
              <button type="button" key={i} onClick={() => setChoice(i)}
                style={{ border: choice===i ? "3px solid #2563eb":"1px solid #e5e7eb", borderRadius:12, padding:6, background:"#fff" }}>
                <img src={`data:image/png;base64,${b64}`} alt={`preview ${i+1}`} style={{ width:"100%", borderRadius:8 }}/>
              </button>
            ))}
          </div>

          <div style={{ marginTop:16, display:"flex", gap:12, alignItems:"center" }}>
            <input type="text" placeholder="Name your Navatar" value={name} onChange={(e)=>setName(e.target.value)}
              style={{ flex:1, padding:10, border:"1px solid #e5e7eb", borderRadius:8 }}/>
            <button className="btn btn-primary" onClick={save} disabled={busy || choice==null}>
              {busy ? "Saving…" : "Save & Own"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
