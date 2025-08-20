import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import HubGrid from "../../components/hubs/HubGrid";

export default function MarketplaceHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Marketplace" }]} />
      <SectionHero title="Marketplace" subtitle="Shop creations and merch." emoji="🛍️" />
      <HubGrid
        items={[
          { to: "/marketplace/catalog", title: "Catalog", emoji: "📦", description: "Browse items." },
          { to: "/marketplace/wishlist", title: "Wishlist", emoji: "❤️", description: "Your favorites." },
          { to: "/marketplace/checkout", title: "Checkout", emoji: "💳", description: "Pay & ship." },
        ]}
      />
    </>
  );
}
