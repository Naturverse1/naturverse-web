import React from "react";
import { useCart } from "../../hooks/useCart";

export default function CartButton() {
  const { items, open } = useCart();
  const count = items.reduce((n, it) => n + it.qty, 0);

  return (
    <button className="cart-btn" aria-label="Open cart" onClick={open}>
      🛒
      {count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}
