import React, { useMemo, useState } from "react";
import { CATALOG } from "../../lib/shop/data";
import { loadWishlist, toggleWish } from "../../lib/shop/store";
import { Item } from "../../lib/shop/types";
import AddToCartButton from "../../components/cart/AddToCartButton";

export default function Catalog() {
  const [wish, setWish] = useState<string[]>(loadWishlist());
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return CATALOG;
    return CATALOG.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q) ||
      (i.tag || "").toLowerCase().includes(q)
    );
  }, [query]);

  const Price = ({item}:{item: Item}) => (
    <span className="price">
      {item.price.currency === "USD" ? `$${item.price.amount}` : `${item.price.amount} ${item.price.currency}`}
    </span>
  );

  return (
    <div>
      <h1>🛍️ Catalog</h1>
      <p>Browse items. Add to wishlist or cart.</p>

      <div className="shop-toolbar">
        <input
          className="input"
          placeholder="Search items…"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          aria-label="Search catalog"
        />
      </div>

      <div className="shop-grid">
        {list.map(it => {
          const wished = wish.includes(it.id);
          return (
            <div key={it.id} className="shop-card">
              <div className="shop-tag">{it.tag}</div>
              <div className="shop-image" aria-hidden>{it.image ?? "📦"}</div>
              <div className="shop-title">{it.name}</div>
              <div className="shop-desc">{it.desc}</div>
              <div className="shop-row">
                <Price item={it} />
                <div className="shop-actions">
                  <button
                    className={"btn tiny outline" + (wished ? " active" : "")}
                    onClick={()=>setWish(toggleWish(it.id))}
                    aria-pressed={wished}
                  >♥</button>
                  <AddToCartButton
                    id={it.id}
                    name={it.name}
                    price={it.price.amount * 100}
                    image={it.image}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="meta">Note: Demo only; checkout is simulated. AI shopping help connects later.</p>
    </div>
  );
}

