import React from "react";
import { createPortal } from "react-dom";
import { useCart, cartSubtotal } from "@/lib/cart";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, setQty, remove, clear } = useCart();
  if (typeof document === "undefined") return null;

  const threshold = 5000; // $50
  const short = threshold - cartSubtotal(cart.items);

  return createPortal(
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)" }} />}
      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 380,
          transform: `translateX(${open ? 0 : 420}px)`,
          transition: "transform .25s ease",
          background: "#fff",
          boxShadow: "-12px 0 24px rgba(0,0,0,.12)",
          padding: 16,
          zIndex: 60,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Your cart</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {cart.items.length === 0 && <p>Your cart is empty.</p>}
          {cart.items.map((it) => (
            <div key={it.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
              <strong>{it.type === "adhoc" ? it.price_data.product_data.name : it.name ?? it.id}</strong>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                <button onClick={() => setQty(it.id, -1)}>-</button>
                <span>{it.qty}</span>
                <button onClick={() => setQty(it.id, +1)}>+</button>
                <button style={{ marginLeft: "auto" }} onClick={() => remove(it.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <footer style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <button onClick={clear} style={{ float: "left" }}>Clear</button>
          <a href="/checkout" style={{ float: "right" }} onClick={() => window.dispatchEvent(new Event("nv:checkout_start"))}>
            Checkout →
          </a>
          {short > 0 ? (
            <p style={{ marginTop: 8, fontSize: 12 }}>You’re ${ (short/100).toFixed(2) } away from free shipping 🎁</p>
          ) : (
            <p style={{ marginTop: 8, fontSize: 12, color: "#059669" }}>Free shipping unlocked! ✅</p>
          )}
        </footer>
      </aside>
    </>,
    document.body
  );
}
