import React from "react";
import { HubGrid } from "../components/HubGrid";

export default function MarketplacePage() {
  return (
    <div>
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
    </div>
  );
}
