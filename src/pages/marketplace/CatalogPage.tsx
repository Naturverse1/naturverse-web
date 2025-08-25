import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function CatalogPage() {
  return (
    <main id="main" data-page="marketplace" className="container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Catalog" },
        ]}
      />

      <h1>Catalog</h1>
      <p className="muted">Browse everything at once.</p>

      <p>
        Jump back to <Link to="/marketplace">Marketplace</Link> or head to{" "}
        <Link to="/marketplace/checkout">Checkout</Link>.
      </p>
      {/* If you already have a grid component for /marketplace,
          you can render it here too, e.g. <ProductGrid /> */}
    </main>
  );
}
