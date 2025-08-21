import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";

export default function Marketplace() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">🛍️ Marketplace</h2>
      <p className="text-gray-600">Shop creations and merch.</p>
      <HubGrid>
        <HubCard to="/marketplace/catalog"  title="Catalog"  desc="Browse items." emoji="📦" />
        <HubCard to="/marketplace/wishlist" title="Wishlist" desc="Your favorites." emoji="❤️" />
        <HubCard to="/marketplace/checkout" title="Checkout" desc="Pay & ship." emoji="💳" />
      </HubGrid>
    </section>
  );
}
