import Breadcrumbs from "../../components/Breadcrumbs";
import ProductCard from "../../components/commerce/ProductCard";
import { products } from "../../lib/commerce/products";

export default function Catalog() {
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
        ]}
      />
      <h1>Marketplace</h1>
      <div className="market-grid">
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}
