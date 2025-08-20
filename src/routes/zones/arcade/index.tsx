import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import SectionHero from "../../../components/common/SectionHero";

const games = [
  { id: "runner", title: "Temple Runner", emoji: "🏃‍♂️" },
  { id: "tiles", title: "Jungle Tiles", emoji: "🧩" },
  { id: "sky", title: "Sky Glider", emoji: "🪂" },
];

export default function ArcadeHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/zones", label: "Zones" }, { label: "Arcade" }]} />
      <SectionHero title="Arcade" subtitle="Pick a game." emoji="🎮" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px", display: "grid", gap: 12 }}>
        {games.map((g) => (
          <Link key={g.id} to={`/zones/arcade/game/${g.id}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fff" }}>
              <div style={{ fontSize: 24 }}>{g.emoji}</div>
              <div style={{ fontWeight: 600 }}>{g.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
