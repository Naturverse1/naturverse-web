import React from "react";
import { HubGrid } from "../components/HubGrid";
import Meta from "../components/Meta";
import Breadcrumbs from "../components/Breadcrumbs";
import RequireAuth from "../components/RequireAuth";

export default function NaturbankPage() {
  return (
    <RequireAuth>
      <div className="page-wrap">
        <Meta title="Naturbank — Naturverse" description="Wallets, token, and collectibles." />
        <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Naturbank" }]} />
        <main id="main">
        <h1>Naturbank</h1>
        <p className="muted">Wallets, token, and collectibles.</p>

      <HubGrid
        items={[
          { to: "/naturbank/wallet", title: "Wallet", desc: "Create custodial wallet & view address.", icon: "👛" },
          { to: "/naturbank/natur", title: "NATUR Token", desc: "Earnings, redemptions, and ledger.", icon: "🟠" },
          { to: "/naturbank/nfts", title: "NFTs", desc: "Mint navatar cards & collectibles.", icon: "🖼️" },
          { to: "/naturbank/learn", title: "Learn", desc: "Crypto basics & safety guides.", icon: "📘" },
        ]}
      />

      <p className="muted" style={{ marginTop: 12 }}>
        Coming soon: live wallets, on-chain mints, and payouts.
      </p>
        </main>
      </div>
    </RequireAuth>
  );
}
