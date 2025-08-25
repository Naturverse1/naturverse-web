import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function CheckoutPage() {
  return (
    <main id="main" data-page="marketplace" className="container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Checkout" },
        ]}
      />

      <h1>Checkout</h1>
      <p className="muted">Cart summary and checkout flow (stub).</p>

      <p>
        Need more? Back to <Link to="/marketplace">Marketplace</Link>.
      </p>
      {/* Cart table + totals slot in here when you’re ready */}
    </main>
  );
}
