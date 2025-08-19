import React from "react";
import { Link } from "react-router-dom";

export default function Zones() {
  const links = [
    ["/zones/music", "Music"],
    ["/zones/wellness", "Wellness"],
    ["/zones/creator-lab", "Creator Lab"],
    ["/zones/community", "Community"],
    ["/zones/ecolab", "EcoLab"],
    ["/zones/naturversity", "Naturversity"],
    ["/zones/parents", "Parents"],
    ["/zones/teachers", "Teachers"],
    ["/zones/partners", "Partners"],
    ["/zones/story-studio", "Story Studio"],
    ["/zones/settings", "Settings"],
  ] as const;

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🌍 Zones</h2>
      <p>Browse biomes and worlds.</p>
      <ul style={{ lineHeight: 1.8 }}>
        {links.map(([to, label]) => (
          <li key={to}><Link to={to}>{label}</Link></li>
        ))}
      </ul>
    </main>
  );
}

