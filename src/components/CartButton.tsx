import { useCart } from '@/lib/cart';

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { items } = useCart();
  const count = items?.length ?? 0;

  return (
    <button
      type="button"
      aria-label="Open cart"
      className="nv-icon-btn nv-cart"
      onClick={onClick}
    >
      <span aria-hidden>🛒</span>
      {count > 0 && <span className="nv-cart-badge">{count}</span>}
    </button>
  );
}
