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
    <header className="site-header">
      <a href="/">Naturverse</a>
      <nav>
        <a href="/worlds">Worlds</a>
        <a href="/zones">Zones</a>
        <a href="/marketplace">Marketplace</a>
      </nav>
      <button className="cart-btn" onClick={() => setOpen(true)}>
        🛒 {items.length > 0 && <span className="cart-count">{items.length}</span>}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

