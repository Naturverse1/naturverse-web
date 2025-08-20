import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import HubGrid from "../../components/hubs/HubGrid";

export default function NaturbankHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Naturbank" }]} />
      <SectionHero title="Naturbank" subtitle="Wallets, NATUR token, and crypto basics." emoji="🪙" />
      <HubGrid
        items={[
          { to: "/naturbank/wallets", title: "Wallets", emoji: "👛", description: "Connect & custodial basics." },
          { to: "/naturbank/natur-token", title: "NATUR Token", emoji: "🌿", description: "Balances & testnets." },
          { to: "/naturbank/learn", title: "Learn Crypto", emoji: "📘", description: "Beginner-friendly guides." },
        ]}
      />
    </>
  );
}
