import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import HubGrid from "../../components/hubs/HubGrid";
import { WORLDS } from "../../data/worlds";

export default function WorldsHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Worlds" }]} />
      <SectionHero title="Worlds" subtitle="Explore the 14 kingdoms." emoji="🗺️" />
      <HubGrid
        items={WORLDS.map((w) => ({
          to: `/worlds/${w.slug}`,
          title: `${w.name}`,
          description: `${w.fruit} & ${w.animal}`,
          emoji: w.emoji,
        }))}
      />
      <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
        <p>Tip: Click any world to view its landing page.</p>
      </div>
    </>
  );
}
