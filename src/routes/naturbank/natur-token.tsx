import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function NaturToken() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturbank", label: "Naturbank" }, { label: "NATUR Token" }]} />
      <SectionHero title="NATUR Token" subtitle="Balances, faucets, and test networks." emoji="🌿" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page. Show token balance and approvals here later.</p>
      </div>
    </>
  );
}
