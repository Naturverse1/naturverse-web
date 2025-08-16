import React from "react";

export default function Arcade() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Arcade</h1>
      <p>Quick brain-boost games. First mini‑game ships now!</p>

      <ul>
        <li>
          <a href="/zones/arcade/memory-match">🧠 Memory Match – play now</a>
        </li>
        <li>🔡 Word Builder — coming soon</li>
        <li>🌿 Eco Runner — coming soon</li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        <a href="/zones">← Back to Zones</a>
      </p>
    </div>
  );
}
