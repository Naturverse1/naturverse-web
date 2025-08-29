import { PRODUCTS } from "../data/products";
import { addToCart } from "../lib/cart";
import RecentCarousel from "@/components/RecentCarousel";

export default function Marketplace() {
  return (
    <main>
      <section className="grid">
        {PRODUCTS.map((p) => (
          <article key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.type}</p>
            <div>
              <strong>${(p.price / 100).toFixed(2)}</strong>
              <button onClick={() => addToCart(p)}>Add to cart</button>
            </div>
          </article>
        ))}
      </section>
      <RecentCarousel />
    </main>
  );
}
