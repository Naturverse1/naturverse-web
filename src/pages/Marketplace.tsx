import React from "react";
import { HubGrid } from "../components/HubGrid";
import { breadcrumbs } from "../lib/jsonld";

const labels = { '/marketplace': 'Marketplace' };

export default function MarketplacePage() {
  return (
    <>
      <main id="main">
        <h1>Marketplace</h1>
        <p className="muted">Shop creations and merch.</p>

        <HubGrid
          items={[
            { to: "/marketplace/catalog", title: "Catalog", desc: "Browse items.", icon: "📦" },
            { to: "/marketplace/wishlist", title: "Wishlist", desc: "Your favorites.", icon: "❤️" },
            { to: "/marketplace/checkout", title: "Checkout", desc: "Pay & ship.", icon: "🧾" },
          ]}
        />

        <p className="muted" style={{ marginTop: 12 }}>
          Coming soon: AI assistance for sizing, bundles, and gift ideas.
        </p>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbs('/marketplace', labels)
          ),
        }}
      />
    </>
  );
}
