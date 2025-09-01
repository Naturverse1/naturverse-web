import { useCart } from '@/lib/cart';
import type { ComponentProps } from 'react';

type CartButtonProps = ComponentProps<'button'>;

export default function CartButton({ className = '', onClick, ...props }: CartButtonProps) {
  const { items } = useCart();
  const count = items?.length ?? 0;

  return (
    <button
      type="button"
      className={`nv-icon-btn nv-cart ${className}`.trim()}
      onClick={onClick}
      aria-label="Open cart"
      {...props}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          d="M6 6h15l-2 9H8L6 6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.75" fill="currentColor" />
        <circle cx="17" cy="20" r="1.75" fill="currentColor" />
      </svg>
      {count > 0 && <span className="nv-cart-badge">{count}</span>}
    </button>
  );
}
