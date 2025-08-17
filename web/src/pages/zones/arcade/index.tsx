import React from "react";
import { Link } from "react-router-dom";

export default function Arcade() {
  const bestEasy = localStorage.getItem("nv:mm:best:easy");
  const bestMed  = localStorage.getItem("nv:mm:best:medium");
  const bestHard = localStorage.getItem("nv:mm:best:hard");
  const coins    = localStorage.getItem("nv:coins") || "0";

  function fmt(s: string){ const n=Number(s); const m=Math.floor(n/60).toString().padStart(2,"0"); const sec=Math.floor(n%60).toString().padStart(2,"0"); return `${m}:${sec}`; }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Arcade</h1>
      <p>Quick brain-boost games. First mini‑game ships now!</p>

      <ul>
        <li>
          <a href="/zones/arcade/memory-match">🧠 Memory Match – play now</a>
          <p style={{opacity:.9}}>
  Best: {bestEasy ? `Easy ${fmt(bestEasy)} ` : ""}
        {bestMed ? `• Medium ${fmt(bestMed)} ` : ""}
        {bestHard ? `• Hard ${fmt(bestHard)} ` : ""}
  <br/>🪙 Coins: {coins}
  </p>
        </li>
        <li>
          <Link to="/zones/arcade/word-builder">Word Builder</Link> — make words from daily letters.
          <div style={{opacity:.9}}>
            Best score today: {localStorage.getItem("nv:wb:best:" + ["nature","ocean","forest"][Math.floor(Date.now()/86400000)%3]) || "—"}
            &nbsp;•&nbsp; 🪙 Coins: {localStorage.getItem("nv:wb:coins") || localStorage.getItem("nv:wb:coins") || "0"}
          </div>
        </li>
        <li>🌿 Eco Runner — coming soon</li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        <a href="/zones">← Back to Zones</a>
      </p>
    </div>
  );
}
