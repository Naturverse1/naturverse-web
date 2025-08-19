import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h1 style={{ margin: "0 0 8px" }}>Welcome 🌿</h1>
      <p style={{ marginBottom: 24 }}>
        Naturverse is live. Jump in below:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        <Link to="/zones">🌎 Zones</Link>
        <Link to="/marketplace">🛒 Marketplace</Link>
        <Link to="/arcade">🎮 Arcade</Link>
        <Link to="/naturversity">🎓 Naturversity</Link>
        <Link to="/rainforest">🌧️ Rainforest</Link>
        <Link to="/oceanworld">🌊 Ocean World</Link>
        <Link to="/desertworld">🏜️ Desert World</Link>
        <Link to="/world-hub">🧭 World Hub</Link>
      </div>

      <hr style={{ margin: "24px 0" }} />
      <h2 style={{ marginBottom: 10 }}>Turian Tips</h2>
      <p>
        Quick wellness + nature nuggets will appear here. (Full “Turian Tips” component
        can slot in later; this is a safe placeholder.)
      </p>
    </section>
  );
}

