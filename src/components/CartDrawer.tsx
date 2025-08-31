import React, { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { getShareLink } from "@/lib/cartShare";
import { PRODUCT_IMG } from "@/data/productImages";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, setQty, removeFromCart, clearCart, totalCents } = useCart();

  // close on ESC
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onClose]);

  function checkout() {
    alert("Checkout is currently unavailable.");
  }

  // NEW: Share cart
  async function shareCart() {
    const url = getShareLink(items.map((i) => ({ id: i.id, qty: i.qty })));
    await navigator.clipboard.writeText(url);
    window.dispatchEvent(
      new CustomEvent("nv:toast", { detail: { text: "Share link copied" } })
    );
  }

  async function shareCartShort() {
    const payload = items.map((i) => ({ id: i.id, qty: i.qty }));
    const res = await fetch("/.netlify/functions/save-cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
    if (!res.ok) {
      window.dispatchEvent(
        new CustomEvent("nv:toast", { detail: { text: "Share failed" } })
      );
      return;
    }
    const { url } = await res.json();
    await navigator.clipboard.writeText(url);
    window.dispatchEvent(
      new CustomEvent("nv:toast", { detail: { text: "Share link copied" } })
    );
  }

  if (!open) return null;
  return (
    <div className="cart-drawer">
      <div className="backdrop" onClick={onClose} />
      <aside className="cart-panel cart-panel--in">
        <header className="cart__hd">
          <h3>Your cart</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="link" onClick={shareCart}>
              Quick link
            </button>
            <button className="link" onClick={shareCartShort}>
              Save &amp; share
            </button>
            <button onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        <ul className="cart__list">
          {items.length === 0 && <li>Cart is empty.</li>}
          {items.map((i) => (
            <li key={i.id} className="cart__row">
              <img
                src={PRODUCT_IMG[i.id] || "/img/market/placeholder.png"}
                alt=""
                className="cart__thumb"
                loading="lazy"
              />
              <div>
                <div className="cart__name">{i.name ?? i.id}</div>
                <div className="cart__meta">
                  ${(i.price / 100).toFixed(2)} × {i.qty}
                </div>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)}>-</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <button className="link" onClick={() => removeFromCart(i.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <footer className="cart__ft">
          <div className="cart__total">
            Subtotal: <strong>${(totalCents / 100).toFixed(2)}</strong>
          </div>
          <div className="cart__actions">
            <button className="btn secondary" onClick={() => clearCart()}>
              Clear
            </button>
            <a
              href="/checkout"
              onClick={() => window.dispatchEvent(new Event("nv:checkout_start"))}
              className="btn primary"
            >
              Checkout
            </a>
          </div>
        </footer>
      </aside>
    </div>
  );
}
