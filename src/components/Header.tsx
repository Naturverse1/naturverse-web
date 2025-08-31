import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="site-header flex items-center gap-4 p-4">
      <Link
        to="/"
        className="flex items-center gap-2 font-semibold tracking-tight text-primary-600"
      >
        <img src="/logo.svg" alt="" className="h-6 w-6" />
        <span className="whitespace-nowrap">The Naturverse</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-4">
        <Link to="/worlds">Worlds</Link>
        <Link to="/zones">Zones</Link>
        <Link to="/marketplace">Marketplace</Link>
      </nav>
      <button
        className="lg:hidden inline-flex items-center rounded-md p-2 hover:bg-slate-100"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      <div className="flex-1 max-w-full lg:max-w-xl px-3"></div>
      <button className="cart-btn" onClick={() => setOpen(true)}>
        🛒 {items.length > 0 && <span className="cart-count">{items.length}</span>}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

