import React from "react";
import { PRODUCTS } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import { clearWishlist, getWishlist } from "../../utils/wishlist";
import "../../components/market.css";

export default function WishlistPage() {
  const [ids, setIds] = React.useState<string[]>(() => getWishlist());
  const list = PRODUCTS.filter(p => ids.includes(p.id));

  function clear() {
    clearWishlist();
    setIds([]);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 10 }}>Your Wishlist</h1>
      <p style={{ opacity: .8, marginTop: 0 }}>
        Items you saved from the marketplace. This is private to this device.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "12px 0 18px" }}>
        <a className="btn" href="/marketplace">Back to Marketplace</a>
        {list.length > 0 && (
          <button className="btn danger" onClick={clear}>Clear wishlist</button>
        )}
      </div>

      {list.length === 0 ? (
        <p style={{ opacity: .7 }}>No items yet. Add some from the marketplace.</p>
      ) : (
        <div className="market-grid">
          {list.map(p => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              summary={p.summary}
              image={p.image}
              price={p.price}
              category={p.category}
              onChange={() => setIds(getWishlist())}
            />
          ))}
        </div>
      )}
    </main>
  );
}
