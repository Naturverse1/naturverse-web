import { useEffect, useState } from "react";
import type { Product } from "../types/commerce";
import { addToCart } from "../lib/cart";
import { getDeviceId } from "../lib/device";

export default function ProductCard({ p }: { p: Product }) {
  const dev = getDeviceId();
  const [hearted, setHearted] = useState(false);

  async function refreshHeart() {
    const r = await fetch(`/.netlify/functions/wishlist?device=${dev}`);
    const data: { product_id: string }[] = await r.json();
    setHearted(data.some(d => d.product_id === p.id));
  }
  useEffect(() => { refreshHeart(); }, []);

  async function toggleHeart(e: React.MouseEvent) {
    e.preventDefault();
    await fetch(`/.netlify/functions/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: dev, product_id: p.id })
    });
    refreshHeart();
  }

  function add(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({ product_id: p.id, title: p.title, price_tokens: p.priceTokens, qty: 1, image: p.image });
  }

  return (
    <div style={{ border:"1px solid #eee", borderRadius:8, padding:12 }}>
      {p.image && <img src={p.image} alt={p.title} style={{ width:"100%", height:160, objectFit:"cover", borderRadius:6 }} />}
      <h4 style={{ margin:"8px 0" }}>{p.title}</h4>
      <p style={{ minHeight:36 }}>{p.desc}</p>
      <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"space-between" }}>
        <strong>{p.priceTokens} NATUR</strong>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={add}>Add to cart</button>
          <button aria-label="wishlist" onClick={toggleHeart}>{hearted ? "💙" : "🤍"}</button>
        </div>
      </div>
    </div>
  );
}
