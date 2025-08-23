import React from "react";
import { HubGrid } from "../components/HubGrid";
import Meta from "../components/Meta";
import { breadcrumbs } from "../lib/jsonld";
import Breadcrumbs from "../components/Breadcrumbs";
import PageHead from "../components/PageHead";

const labels = { '/marketplace': 'Marketplace' };

export default function MarketplacePage() {
    return (
      <>
        <PageHead title="Naturverse — Marketplace" description="Shop Naturverse creations, merch, and bundles." />
        <Meta title="Marketplace — Naturverse" description="Shop Naturverse creations, merch, and bundles." />
        <div className="page-wrap">
          <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Marketplace" }]} />
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
        </div>

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
