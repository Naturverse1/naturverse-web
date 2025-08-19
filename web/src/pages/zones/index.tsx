import React from "react";
import { Link } from "react-router-dom";

const ZONES = [
  { slug: "rainforest", title: "Rainforest", emoji: "🌧️", blurb: "Lush canopies and biodiversity." },
  { slug: "oceanworld", title: "Ocean World", emoji: "🌊", blurb: "Deep blue wonders." },
  { slug: "desertworld", title: "Desert World", emoji: "🏜️", blurb: "Dunes, stars, survival." },
];

export default function Zones() {
  return (
    <section>
      <h1>🌍 Zones</h1>
      <p>Browse biomes and worlds.</p>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "grid", gap: 14 }}>
        {ZONES.map(z => (
          <li key={z.slug} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{z.emoji} {z.title}</h3>
            <p style={{ marginBottom: 10 }}>{z.blurb}</p>
            <Link to={`/${z.slug}`}>Enter {z.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

