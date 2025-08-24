import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
export default function CartBadge() {
  const { count } = useCart();
  return (
    <Link to="/cart" aria-label="Cart" className="nv-cart-badge">
      🛒{count>0 && <span className="nv-cart-dot">{count}</span>}
    </Link>
  );
}
