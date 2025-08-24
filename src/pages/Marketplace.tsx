import React from "react";
import { HubGrid } from "../components/HubGrid";
import Meta from "../components/Meta";
import { breadcrumbs } from "../lib/jsonld";
import Breadcrumbs from "../components/Breadcrumbs";
import PageHead from "../components/PageHead";
import { PRODUCTS } from "../data/marketplace";
import { setTitle } from "./_meta";

const labels = { '/marketplace': 'Marketplace' };

export default function MarketplacePage() {
    setTitle("Marketplace");
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

        {PRODUCTS.length > 0 && (
          <div className="cards grid-gap" style={{ marginTop: 20 }}>
            {PRODUCTS.map((p) => (
              <a key={p.id} className="card" href={`/marketplace/${p.id}`}>
                {p.imageSrc && (
                  <img
                    src={p.imageSrc}
                    alt={p.imageAlt ?? p.name}
                    loading="lazy"
                    style={{ width: "100%", height: "auto", borderRadius: "0.5rem" }}
                  />
                )}
                <h2>{p.name}</h2>
                <p>${p.price.toFixed(2)}</p>
              </a>
            ))}
          </div>
        )}

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
