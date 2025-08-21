import React, { useMemo, useState } from "react";
import { CATALOG } from "../../lib/shop/data";
import { clearCart, loadCart, removeLine, setQty } from "../../lib/shop/store";

export default function Checkout() {
  const [cart, setCart] = useState(loadCart());

  const lines = useMemo(() => cart.map(l => ({ ...l, item: CATALOG.find(i => i.id === l.id)! })), [cart]);
  const total = useMemo(() => lines.reduce((s,x)=> s + (x.item.price.amount * x.qty), 0), [lines]);

  const pay = () => {
    // Simulated checkout: clear & thank you.
    clearCart(); setCart([]);
    alert("Thanks! This is a demo checkout.");
  };

  return (
    <div>
      <h1>💳 Checkout</h1>
      {lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="shop-list">
            {lines.map(l => (
              <div key={l.id} className="shop-row-card">
                <div className="shop-image sm">{l.item.image ?? "📦"}</div>
                <div className="grow">
                  <div className="shop-title">{l.item.name}</div>
                  <div className="shop-desc">${l.item.price.amount} · {l.item.tag}</div>
                </div>
                <div className="qty">
                  <button className="btn tiny outline" onClick={()=>{ setCart(setQty(l.id, Math.max(0, l.qty-1))); }}>−</button>
                  <span aria-live="polite" className="q">{l.qty}</span>
                  <button className="btn tiny outline" onClick={()=>{ setCart(setQty(l.id, l.qty+1)); }}>＋</button>
                </div>
                <button className="btn tiny danger" onClick={()=>{ setCart(removeLine(l.id)); }}>Remove</button>
              </div>
            ))}
          </div>
          <div className="checkout-total">Total: <strong>${total.toFixed(2)}</strong></div>
          <button className="btn" onClick={pay}>Pay (demo)</button>
          <p className="meta">Coming soon: shipping, NATUR coin, and AI shopping assistant.</p>
        </>
      )}
    </div>
  );
}

