import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function Partners() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturversity", label: "Naturversity" }, { label: "Partners" }]} />
      <SectionHero title="Partners" subtitle="Organizations we collaborate with." emoji="🤝" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
