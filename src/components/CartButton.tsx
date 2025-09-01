import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';

export default function CartButton({
  className = '',
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  const { items } = useCart();
  const { user, ready } = useAuth();
  if (ready && !user) return null;
  const count = items?.length ?? 0;

  return (
    <button
      type="button"
      aria-label="Open cart"
      className={`${className} nv-cart`.trim()}
      onClick={onClick}
    >
      <span aria-hidden>🛒</span>
      {count > 0 && <span className="nv-cart-badge">{count}</span>}
    </button>
  );
}
