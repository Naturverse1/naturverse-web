import React, { useState } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import { loadPassport, mintLocalNFT } from "../../lib/passport";

export default function NFTsPage() {
  const [name, setName] = useState("My Navatar NFT");
  const [imageUrl, setImageUrl] = useState("");
  const [owned, setOwned] = useState(loadPassport().nfts);

  function onMint() {
    const { passport } = mintLocalNFT(name.trim() || "Navatar NFT", imageUrl || undefined, true);
    setOwned(passport.nfts.slice().reverse());
  }

  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturbank", label: "Naturbank" }, { label: "NFTs" }]} />
      <SectionHero title="NFTs" subtitle="Mint & collect." emoji="🧾" />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px 48px" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24, background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Mint a Placeholder NFT</h3>
          <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
            <button onClick={onMint} style={{ padding: "8px 12px" }}>Mint (local)</button>
          </div>
          <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
            This stores a mock NFT in your browser for now. Later we’ll hook real chains.
          </p>
        </div>

        <h3>Your NFTs</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {owned.length === 0 ? <p>No NFTs yet.</p> : owned.map(n => (
            <div key={n.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" }}>
              {n.imageUrl ? <img src={n.imageUrl} alt={n.name} style={{ width: "100%", borderRadius: 8, objectFit: "cover", height: 140 }} /> : null}
              <div style={{ fontWeight: 600, marginTop: 8 }}>{n.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{n.id}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
