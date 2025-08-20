import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function MusicZone() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/zones", label: "Zones" }, { label: "Music" }]} />
      <SectionHero title="Music Zone" subtitle="Coming alive soon." emoji="🎵" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
