import React, { useMemo, useState } from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import SectionHero from "../components/common/SectionHero";
import { mintLocalNFT, updateHolder, loadPassport } from "../lib/passport";

const TYPES = ["fruit", "animal", "insect", "spirit"] as const;
const TRAIT_BANK = ["brave", "curious", "clever", "kind", "swift", "gentle", "loud", "quiet", "sparkly", "sneaky"];

export default function NavatarPage() {
  const initial = loadPassport().holder;
  const [navType, setNavType] = useState<string>(initial?.navatarType || "fruit");
  const [name, setName] = useState(initial?.name || "");
  const [traits, setTraits] = useState<string[]>(initial?.traits || []);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [story, setStory] = useState("");

  const traitOptions = useMemo(() => TRAIT_BANK, []);

  function toggleTrait(t: string) {
    setTraits(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  }

  function saveProfile() {
    updateHolder({ name, navatarType: navType, traits, imageUrl });
    alert("Navatar saved to Passport.");
  }

  function genStory() {
    const t = (traits[0] || "brave");
    const s = `Born under the starlight, ${name || "your Navatar"} is a ${t} ${navType} who roams the realms helping friends, collecting stamps, and earning NATUR.`;
    setStory(s);
  }

  function mintCard() {
    const title = name ? `${name} — ${navType} card` : `Navatar — ${navType} card`;
    mintLocalNFT(title, imageUrl || undefined, true);
    alert("Minted local Navatar card to your NFTs.");
  }

  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Navatar" }]} />
      <SectionHero title="Navatar Creator" subtitle="Design your character, story, and card." emoji="🧩" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 48px", display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>1) Basics</h3>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Turian, Mango Mike, ..." />
            <label style={{ marginTop: 8, display: "block" }}>Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setNavType(t)}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: navType === t ? "#eef2ff" : "#fff" }}
                >
                  {t}
                </button>
              ))}
            </div>
            <label style={{ marginTop: 8, display: "block" }}>Avatar Image URL (optional)</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            <button style={{ marginTop: 12 }} onClick={saveProfile}>Save to Passport</button>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>2) Traits</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {traitOptions.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTrait(t)}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: traits.includes(t) ? "#dcfce7" : "#fff" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>3) Backstory (AI stub)</h3>
            <p style={{ fontSize: 12, opacity: 0.8 }}>Click generate to draft a backstory. (Placeholder; connect to OpenAI later.)</p>
            <button onClick={genStory}>Generate Backstory</button>
            <textarea value={story} onChange={e => setStory(e.target.value)} rows={6} style={{ width: "100%", marginTop: 8 }} />
          </div>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>4) Character Card / NFT</h3>
            <button onClick={mintCard}>Mint Navatar Card (local)</button>
            <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>View in Naturbank → NFTs.</p>
          </div>
        </div>
      </div>
    </>
  );
}
