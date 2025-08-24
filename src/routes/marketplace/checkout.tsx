import Breadcrumbs from "../../components/Breadcrumbs";

export default function Checkout() {
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Checkout", href: "/marketplace/checkout" },
        ]}
      />
      <h1>Checkout</h1>
      <p>Coming soon.</p>
    </section>
  );
}
