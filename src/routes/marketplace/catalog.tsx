import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function Catalog() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/marketplace", label: "Marketplace" }, { label: "Catalog" }]} />
      <SectionHero title="Catalog" subtitle="Product listing." emoji="📦" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
