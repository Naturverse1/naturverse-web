import React, { useEffect, useState } from "react";
import { CATALOG } from "../../lib/shop/data";
import { addToCart, loadWishlist, toggleWish } from "../../lib/shop/store";

export default function Wishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(()=>setIds(loadWishlist()), []);

  const items = CATALOG.filter(i => ids.includes(i.id));

  return (
    <main id="main" className="page-wrap">
      <h1>❤️ Wishlist</h1>
      {items.length === 0 && <p>No favorites yet. Add some from the Catalog.</p>}
      <div className="shop-list">
        {items.map(it => (
          <div key={it.id} className="shop-row-card">
            <div className="shop-image sm">{it.image ?? "📦"}</div>
            <div className="grow">
              <div className="shop-title">{it.name}</div>
              <div className="shop-desc">{it.desc}</div>
            </div>
            <div className="actions">
              <button className="btn tiny outline" onClick={()=>{ setIds(toggleWish(it.id)); }}>Remove</button>
              <button className="btn tiny" onClick={()=>addToCart(it.id, 1)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

