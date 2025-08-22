import React from "react";
import { useCart } from "../../hooks/useCart";

export default function CartDrawer() {
  const { isOpen, close, items, remove, updateQty, subtotal, clear } = useCart();

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
      <div className="panel">
        <div className="hdr">
          <h2>Cart</h2>
          <button onClick={close} aria-label="Close">✖︎</button>
        </div>

        {items.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <ul className="lines">
            {items.map(it => (
              <li key={it.id + (it.variant || "")} className="line">
                <div className="info">
                  <strong>{it.name}</strong>
                  {it.variant && <span className="muted"> · {it.variant}</span>}
                </div>
                <div className="qty">
                  <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1), it.variant)} aria-label="Decrease">−</button>
                  <input
                    aria-label="Quantity"
                    value={it.qty}
                    onChange={e => updateQty(it.id, Math.max(1, Number(e.target.value) || 1), it.variant)}
                  />
                  <button onClick={() => updateQty(it.id, it.qty + 1, it.variant)} aria-label="Increase">＋</button>
                </div>
                <div className="amt">${((it.price * it.qty)/100).toFixed(2)}</div>
                <button className="rm" onClick={() => remove(it.id, it.variant)} aria-label={`Remove ${it.name}`}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <div className="foot">
          <div className="total"><span>Subtotal</span><strong>${(subtotal/100).toFixed(2)}</strong></div>
          <div className="actions">
            <button onClick={clear} className="link">Clear</button>
            <a className="btn" href="/checkout">Checkout</a>
          </div>
        </div>
      </div>
      <div className="scrim" onClick={close} />
    </div>
  );
}
