import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableCoins } from "../../../lib/coins";

export default function Arcade() {
  const bestEasy = localStorage.getItem("nv:mm:best:easy");
  const bestMed  = localStorage.getItem("nv:mm:best:medium");
  const bestHard = localStorage.getItem("nv:mm:best:hard");
  const [coins, setCoins] = useState(0);

  function fmt(s: string){ const n=Number(s); const m=Math.floor(n/60).toString().padStart(2,"0"); const sec=Math.floor(n%60).toString().padStart(2,"0"); return `${m}:${sec}`; }

  useEffect(() => {
    setCoins(getAvailableCoins());
    const i = setInterval(() => setCoins(getAvailableCoins()), 800);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Arcade</h1>
      <p style={{margin:"6px 0 14px"}}>
        Your coins: <strong>🪙 {coins}</strong> — <Link to="/zones/arcade/shop">open Rewards Shop</Link>
      </p>
      <p>Quick brain-boost games. First mini‑game ships now!</p>

      <ul>
        <li>
          <a href="/zones/arcade/memory-match">🧠 Memory Match – play now</a>
          <p style={{opacity:.9}}>
  Best: {bestEasy ? `Easy ${fmt(bestEasy)} ` : ""}
        {bestMed ? `• Medium ${fmt(bestMed)} ` : ""}
        {bestHard ? `• Hard ${fmt(bestHard)} ` : ""}
  </p>
        </li>
        <li><Link to="/zones/arcade/word-builder">Word Builder – build words before time runs out!</Link></li>
        <li><Link to="/zones/arcade/eco-runner">Eco Runner</Link> — jump, collect, dodge.</li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        <a href="/zones">← Back to Zones</a>
      </p>
    </div>
  );
}
