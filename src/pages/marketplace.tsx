import { PRODUCTS } from "../data/products";
import { addToCart } from "../lib/cart";
import RecentCarousel from "@/components/RecentCarousel";
import { getStock, isDigital } from "@/data/inventory";

export default function Marketplace() {
  return (
    <main>
      <section className="grid">
        {PRODUCTS.map((p) => {
          const s = getStock(p.id);
          const qty = s?.qty ?? 0;
          const lowAt = s?.lowAt ?? 5;
          const soldOut = !isDigital(p.id) && qty <= 0;
          return (
            <article key={p.id}>
              <h3>{p.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="pill">{p.type === 'physical' ? 'Physical' : 'Digital'}</span>
                {!isDigital(p.id) && qty > 0 && qty <= lowAt && (
                  <span className="pill warn">Only {qty} left</span>
                )}
                {soldOut && <span className="pill danger">Sold out</span>}
                <strong style={{ marginLeft: "auto" }}>${(p.price / 100).toFixed(2)}</strong>
              </div>
              <button
                className="btn primary"
                onClick={() => addToCart(p)}
                disabled={soldOut}
                aria-disabled={soldOut}
              >
                {soldOut ? "Sold out" : "Add to cart"}
              </button>
            </article>
          );
        })}
      </section>
      <RecentCarousel />
    </main>
  );
}
