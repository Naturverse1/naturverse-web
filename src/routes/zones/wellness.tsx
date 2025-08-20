import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function WellnessZone() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/zones", label: "Zones" }, { label: "Wellness" }]} />
      <SectionHero title="Wellness Zone" subtitle="Mind & body." emoji="🧘‍♀️" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
