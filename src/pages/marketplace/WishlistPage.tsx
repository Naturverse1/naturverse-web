import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function WishlistPage() {
  return (
    <main id="main" data-page="wishlist" className="container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Wishlist" },
        ]}
      />

      <h1>Wishlist</h1>
      <p className="muted">Save items you love for later.</p>

      <p>
        Continue shopping in <Link to="/marketplace">Marketplace</Link> or go to{" "}
        <Link to="/marketplace/checkout">Checkout</Link>.
      </p>
      {/* Placeholder list until we hook this to state/storage */}
    </main>
  );
}
