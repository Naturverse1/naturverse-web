import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function Wallets() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturbank", label: "Naturbank" }, { label: "Wallets" }]} />
      <SectionHero title="Wallets" subtitle="Connect options and custodial overview." emoji="👛" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page. Hook up wallet connect here later.</p>
      </div>
    </>
  );
}
