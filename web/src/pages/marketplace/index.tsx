import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

import * as productsLib from "../../lib/products";

export default function Marketplace() {
  const items = (productsLib as any).products ?? [];
  return (
    <section>
      <h2>🛒 Marketplace</h2>
      <p>Discover and trade Naturverse items.</p>

      {items.length === 0 ? (
        <>
          <p>No products seeded yet.</p>
          <p>Add items in <code>lib/products.ts</code> to populate this grid.</p>
        </>
      ) : (
        <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))"}}>
          {items.map((p:any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <p style={{marginTop:16}}>
        View your orders in <Link to="/profile">Account</Link>.
      </p>
    </section>
  );
}

