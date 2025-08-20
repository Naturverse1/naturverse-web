import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function LearnCrypto() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturbank", label: "Naturbank" }, { label: "Learn" }]} />
      <SectionHero title="Learn Crypto" subtitle="Short guides for families." emoji="📘" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <ul>
          <li>What is a wallet?</li>
          <li>What is a blockchain?</li>
          <li>What is gas?</li>
        </ul>
      </div>
    </>
  );
}
