import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function CreatorLab() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/zones", label: "Zones" }, { label: "Creator Lab" }]} />
      <SectionHero title="Creator Lab" subtitle="Make and share." emoji="🧪" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
