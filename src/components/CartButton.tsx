import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import CartDrawer from "./CartDrawer";

export default function CartButton({ className }: { className?: string }) {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const count = cart.items.reduce((n, it) => n + it.qty, 0);

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open cart" className={className} style={{ position: "relative" }}>
        <span role="img" aria-label="cart">🛒</span>
        <span style={{ marginLeft: 4 }}>{count}</span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
