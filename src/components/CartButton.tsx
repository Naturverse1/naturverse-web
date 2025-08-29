import { useCart } from "@/lib/cart";
import { Link } from "react-router-dom";

export default function CartButton({ className }: { className?: string }) {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <Link to="/checkout" aria-label="Cart" className={className} style={{ position: "relative" }}>
      <span role="img" aria-label="cart">🛒</span>
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -10,
            fontSize: 12,
            background: "#2563eb",
            color: "white",
            borderRadius: 999,
            padding: "2px 6px",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
