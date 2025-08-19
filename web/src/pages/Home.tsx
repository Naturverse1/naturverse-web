import React from "react";
import { Link } from "react-router-dom";
import TurianTips from "../components/TurianTips";

export default function Home() {
  return (
    <section>
      <h1 style={{ margin: "0 0 8px" }}>Welcome 🌿</h1>
      <p style={{ marginBottom: 24 }}>Naturverse is live. Jump in below:</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
        <Link to="/zones">🌎 Zones</Link>
        <Link to="/marketplace">🛒 Marketplace</Link>
        <Link to="/arcade">🎮 Arcade</Link>
        <Link to="/naturversity">🎓 Naturversity</Link>
        <Link to="/wellness">🧘 Wellness</Link>
        <Link to="/music">🎵 Music</Link>
        <Link to="/world-hub">🧭 World Hub</Link>
        <Link to="/oceanworld">🌊 Ocean World</Link>
        <Link to="/desertworld">🏜️ Desert World</Link>
      </div>

      <hr style={{ margin:"24px 0" }} />
      <TurianTips />
    </section>
  );
}

