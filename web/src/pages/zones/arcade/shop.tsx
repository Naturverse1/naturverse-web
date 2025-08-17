import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableCoins, trySpend, isOwned, setOwned } from "../../../lib/coins";

type Item = { id: string; name: string; cost: number; desc: string };

const ITEMS: Item[] = [
  { id: "theme-aurora", name: "Aurora Theme", cost: 8,  desc: "Glow trails & aurora bg" },
  { id: "theme-jungle", name: "Jungle Theme",  cost: 6,  desc: "Leaf particles + sfx" },
  { id: "emote-sparkle", name: "Sparkle Emote", cost: 4, desc: "Celebrate wins ✨" },
  { id: "badge-explorer", name: "Explorer Badge", cost: 3, desc: "Profile flair 🧭" },
];

export default function ArcadeShop() {
  const [coins, setCoins] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const refresh = () => setCoins(getAvailableCoins());

  useEffect(() => {
    refresh();
    const i = setInterval(refresh, 800); // reflect new coins after games
    return () => clearInterval(i);
  }, []);

  function buy(it: Item) {
    if (isOwned(it.id)) { setToast("Already owned!"); return; }
    if (!trySpend(it.cost)) { setToast("Not enough coins yet! Play more 😄"); return; }
    setOwned(it.id, true);
    refresh();
    setToast(`Purchased ${it.name}!`);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <div style={{maxWidth: 960, margin:"0 auto", padding:"1rem"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
        <h1 style={{margin:0}}>🛍️ Rewards Shop</h1>
        <Link to="/zones/arcade">← Back to Arcade</Link>
      </div>
      <p style={{opacity:.9}}>Earn 🪙 by playing mini-games. Spend them on fun cosmetics.</p>

      <div style={{display:"flex", gap:16, alignItems:"center", margin:"8px 0 16px"}}>
        <div style={{fontWeight:700}}>Your Coins:</div>
        <div style={{padding:"4px 10px", borderRadius:8, background:"#13233a"}}>🪙 {coins}</div>
        {toast && <div style={{marginLeft:8, opacity:.9}}>{toast}</div>}
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16}}>
        {ITEMS.map(it => {
          const owned = isOwned(it.id);
          return (
            <div key={it.id} style={{background:"#0e1b2f", borderRadius:12, padding:14, border:"1px solid #1c3557"}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                <strong>{owned ? `✅ ${it.name}` : it.name}</strong>
                <span>🪙 {it.cost}</span>
              </div>
              <div style={{opacity:.9, minHeight:36}}>{it.desc}</div>
              <button
                disabled={owned}
                onClick={() => buy(it)}
                style={{marginTop:10, padding:"6px 10px", borderRadius:8, border:"1px solid #27486f", background:"#13233a", color:"#eaf2ff", cursor: owned ? "default":"pointer"}}
              >
                {owned ? "Owned" : "Buy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
