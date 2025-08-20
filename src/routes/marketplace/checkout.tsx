import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function Checkout() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/marketplace", label: "Marketplace" }, { label: "Checkout" }]} />
      <SectionHero title="Checkout" subtitle="Pay & ship." emoji="💳" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
