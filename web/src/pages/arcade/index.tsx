import React from "react";
import { Link } from "react-router-dom";

export default function Arcade() {
  return (
    <section>
      <h1>🎮 Arcade</h1>
      <p>Interactive Naturverse games.</p>
      <ul style={{ marginTop: 16, lineHeight: 1.8 }}>
        <li><Link to="/arcade/brain-challenge">🧠 Brain Challenge</Link> – match pairs</li>
        <li><Link to="/arcade/nature-clicker">🌿 Nature Clicker</Link> – tap sprouts to grow a forest</li>
      </ul>
    </section>
  );
}

