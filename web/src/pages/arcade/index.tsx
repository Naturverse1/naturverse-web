import React from "react";
import { Link } from "react-router-dom";

export default function Arcade() {
  return (
    <section>
      <h1>🎮 Arcade</h1>
      <p>Interactive Naturverse games.</p>

      <ul style={{ marginTop: 16 }}>
        <li><Link to="/arcade/brain-challenge">🧠 Brain Challenge</Link></li>
      </ul>
    </section>
  );
}

