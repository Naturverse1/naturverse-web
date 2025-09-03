import { useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { PRODUCTS } from "../data/products";
import { addToCart } from "../lib/cart";
import RecentCarousel from "@/components/RecentCarousel";
import { getStock, isDigital } from "@/data/inventory";
import { assign, expose, convert } from "@/lib/exp";

export default function Marketplace() {
  const variant = useMemo(() => assign("market_cta", ["classic","spicy","zen"], [1,1,1]), []);
  useEffect(() => { expose("market_cta", variant); }, [variant]);

  const ctaText =
    variant === "spicy" ? "🔥 Level up now"
    : variant === "zen" ? "🧘 Begin your journey"
    : "Shop marketplace";

  return (
    <main className="container py-8">
      <h1 className="h1 mb-4">Marketplace</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <Link className="btn btn-outline" to="/marketplace/wishlist">Wishlist</Link>
        <Link className="btn btn-outline" to="/marketplace/nft">NFT</Link>
        <Link className="btn btn-outline" to="/marketplace/saved">Saved</Link>
        <Link className="btn btn-outline" to="/marketplace/specials">Specials</Link>
      </div>

      <a className="btn primary" href="#items" onClick={() => convert("market_cta", variant, { click: true })}>
        {ctaText}
      </a>
      <section className="grid" id="items">
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
