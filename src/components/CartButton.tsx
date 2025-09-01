import { useCart } from '@/lib/cart';

type Props = {
  onClick: () => void;
  className?: string;
  variant?: 'chip' | 'pill';
};

export default function CartButton({
  onClick,
  className = '',
  variant = 'chip',
}: Props) {
  const { items } = useCart();
  const count = items?.length ?? 0;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        aria-label="Open cart"
        className={`nv-pill ${className}`.trim()}
        onClick={onClick}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="#1f3ef8"
            d="M7 6h14l-1.5 9h-12zm0-2V2H2v2h2l3.6 7.59-1.35 2.44A2 2 0 008 16h12v-2H8.42l.93-1.67h7.45c.75 0 1.4-.52 1.57-1.25L19 4H7z"
          />
        </svg>
        {count > 0 && (
          <span className="nv-badge" aria-hidden="true">
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Open cart"
      className={`nv-icon-btn nv-cart ${className}`.trim()}
      onClick={onClick}
    >
      <span aria-hidden>🛒</span>
      {count > 0 && <span className="nv-cart-badge">{count}</span>}
    </button>
  );
}
