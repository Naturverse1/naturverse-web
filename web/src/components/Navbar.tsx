import { useEffect, useRef, useState } from 'react';
import { getCart } from '../lib/cart';
import { getWishlist, subscribe as subWish, unsubscribe as unsubWish } from '../lib/wishlist';
import { Link, NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  (isActive ? 'nav-active' : undefined);

export default function Navbar() {
  const [count, setCount] = useState(0);
  const [wishCount, setWishCount] = useState(getWishlist().length);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setCount(getCart().reduce((s, l) => s + l.qty, 0));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    const cb = (ids: string[]) => setWishCount(ids.length);
    subWish(cb);
    return () => unsubWish(cb);
  }, []);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
    <nav
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(10,16,32,.8)',
        borderBottom: '1px solid rgba(255,255,255,.1)',
      }}
    >
      <NavLink end to="/" className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/worlds" className={linkClass}>
        Worlds
      </NavLink>
      <NavLink to="/zones" className={linkClass}>
        Zones
      </NavLink>
      <NavLink to="/zones/arcade" className={linkClass}>
        Arcade
      </NavLink>
      <NavLink to="/marketplace" className={linkClass}>
        Marketplace
      </NavLink>
      <div className="menu" ref={moreRef}>
        <button className="menu-btn" onClick={() => setMoreOpen(!moreOpen)}>
          More
        </button>
        {moreOpen && (
          <div className="menu-pop">
            <NavLink to="/about" className="menu-item" onClick={() => setMoreOpen(false)}>
              About
            </NavLink>
            <NavLink to="/faq" className="menu-item" onClick={() => setMoreOpen(false)}>
              FAQ
            </NavLink>
            <NavLink to="/settings" className="menu-item" onClick={() => setMoreOpen(false)}>
              Settings
            </NavLink>
            <NavLink to="/privacy" className="menu-item" onClick={() => setMoreOpen(false)}>
              Privacy
            </NavLink>
            <NavLink to="/terms" className="menu-item" onClick={() => setMoreOpen(false)}>
              Terms
            </NavLink>
            <NavLink to="/contact" className="menu-item" onClick={() => setMoreOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/support" className="menu-item" onClick={() => setMoreOpen(false)}>
              Support
            </NavLink>
          </div>
        )}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <NavLink to="/account/wishlist" className={linkClass}>
          Wishlist {wishCount ? <span className="badge">{wishCount}</span> : null}
        </NavLink>
        <Link to="/marketplace/checkout" className="cart-link">
          Cart {count ? <span className="badge">{count}</span> : null}
        </Link>
        <UserMenu />
      </div>
    </nav>
  );
}

