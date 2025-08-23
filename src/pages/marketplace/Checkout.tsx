import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Img } from "../../components";

const money = (cents: number) => `$${(cents/100).toFixed(2)}`;

export default function CheckoutPage() {
  const cart = useCart();
  const [code, setCode] = useState(cart.state.coupon ?? "");

  return (
    <main id="main" className="page-wrap checkout">
      <h1>Checkout</h1>

      {!cart.state.items.length && (
        <p className="muted">Your cart is empty.</p>
      )}

      {!!cart.state.items.length && (
        <>
          <ul className="cart-list">
            {cart.state.items.map(it => (
              <li key={`${it.id}:${it.variant || ""}`} className="cart-row">
                <Img src={it.image || "/placeholders/box.png"} alt={it.name}/>
                <div className="meta">
                  <strong>{it.name}</strong>
                  {it.variant && <div className="muted">{it.variant}</div>}
                  <div className="muted">{money(it.price)}</div>
                </div>
                <div className="qty">
                  <button onClick={() => cart.dec(it.id, it.variant)} aria-label="Decrease">−</button>
                  <input value={it.qty} onChange={(e)=>cart.setQty(it.id, Math.max(1, Number(e.target.value)||1), it.variant)} />
                  <button onClick={() => cart.inc(it.id, it.variant)} aria-label="Increase">+</button>
                </div>
                <div className="line">{money(it.price * it.qty)}</div>
                <button className="remove" onClick={() => cart.remove(it.id, it.variant)} aria-label="Remove">✕</button>
              </li>
            ))}
          </ul>

          <div className="notes">
            <label>
              Order note
              <textarea placeholder="Gift message, delivery notes…" value={cart.state.note || ""} onChange={(e)=>cart.setNote(e.target.value)} />
            </label>
          </div>

          <div className="coupon">
            <label>
              Promo code
              <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Optional"/>
            </label>
            <button onClick={()=>cart.setCoupon(code.trim() || null)}>Apply</button>
          </div>

          <div className="totals">
            <div><span>Subtotal</span><span>{money(cart.totals.subtotal)}</span></div>
            {!!cart.totals.discount && <div><span>Discount</span><span>−{money(cart.totals.discount)}</span></div>}
            <div><span>Tax</span><span>{money(cart.totals.tax)}</span></div>
            <div><span>Shipping</span><span>{cart.totals.shipping ? money(cart.totals.shipping) : "Free"}</span></div>
            <div className="grand"><span>Total</span><span>{money(cart.totals.total)}</span></div>
          </div>

          <div className="actions">
            <button className="btn-secondary" onClick={cart.clear}>Clear cart</button>
            <button className="btn-primary">Pay later (stub)</button>
          </div>
        </>
      )}
    </main>
  );
}
