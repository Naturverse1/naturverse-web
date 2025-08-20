import { useEffect, useState } from "react";
import type { Product } from "../types/commerce";
import { addToCart } from "../lib/cart";
import { getDeviceId } from "../lib/device";

export default function ProductCard({ p }: { p: Product }) {
  const [hearted, setHearted] = useState(false);
  const dev = getDeviceId();

  async function loadHeart() {
    const r = await fetch(`/.netlify/functions/wishlist?device=${dev}`);
    const data: { product_id: string }[] = await r.json();
    setHearted(data.some(d => d.product_id === p.id));
  }
  useEffect(()=>{ loadHeart(); }, []);

  async function toggleHeart() {
    await fetch(`/.netlify/functions/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: dev, product_id: p.id })
    });
    loadHeart();
  }

  return (
    <div style={{border:"1px solid #eee",padding:12,borderRadius:8}}>
      {p.image && <img src={p.image} alt={p.title} style={{width:"100%",height:160,objectFit:"cover"}} />}
      <h4>{p.title}</h4>
      <p>{p.desc}</p>
      <p><strong>{p.priceTokens} NATUR</strong></p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>addToCart({ product_id: p.id, title: p.title, price_tokens: p.priceTokens, qty:1, image:p.image })}>Add to cart</button>
        <button onClick={toggleHeart}>{hearted ? "💙" : "🤍"}</button>
      </div>
    </div>
  );
}

