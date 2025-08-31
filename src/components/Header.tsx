import { useState, useEffect } from 'react';
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
    <header className="w-full border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="inline-flex items-center gap-2 shrink-0">
          <img src="/favicon-32x32.png" alt="Naturverse" className="h-6 w-6" />
          <span className="text-xl font-semibold tracking-tight">The Naturverse</span>
        </a>

        {/* Right-side actions */}
        <div className="flex items-center gap-3">
          {/* Hide “heavy” buttons on very small screens */}
          <div className="hidden sm:flex items-center gap-3">
            {/* keep your wallet/cart/etc components here */}
            <button className="cart-btn" onClick={() => setOpen(true)}>
              🛒 {items.length > 0 && <span className="cart-count">{items.length}</span>}
            </button>
          </div>

          {/* Mobile menu trigger (only <sm) */}
          <button className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200">
            <span className="sr-only">Open menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M3 6h14v2H3zm0 6h14v2H3z"/></svg>
          </button>
        </div>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

