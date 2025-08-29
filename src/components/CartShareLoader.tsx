import { useEffect } from "react";
import { decodeCart } from "@/lib/cartShare";
import { useCart } from "@/lib/cart";

export default function CartShareLoader() {
  const { addToCart } = useCart();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const raw = p.get("cart");
    if (!raw) return;
    const lines = decodeCart(raw);
    lines.forEach(({ id, qty }) => {
      // minimal merge: add id with qty (price/name derived by your product map elsewhere)
      // fallback product stub:
      addToCart({ id, name: id, price: 0, type: "digital" } as any, qty || 1);
    });
    // clean URL (no reload)
    p.delete("cart");
    const url = `${window.location.pathname}${p.toString() ? `?${p}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new CustomEvent("nv:toast", { detail: { text: "Cart loaded" } }));
  }, [addToCart]);

  return null;
}
