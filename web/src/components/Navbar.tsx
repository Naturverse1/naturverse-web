import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { getNavatar } from '../lib/navatar';
import { getWishlist, subscribe, unsubscribe } from '../lib/wishlist';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-active' : undefined;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { items } = useCart();
  const { theme, setTheme } = useTheme();
  const [wishCount, setWishCount] = useState(getWishlist().length);

  useEffect(() => {
    const cb = (ids: string[]) => setWishCount(ids.length);
    subscribe(cb);
    return () => unsubscribe(cb);
  }, []);

  const cartQty = items.reduce((sum, i) => sum + i.qty, 0);

  const img = getNavatar();

  return (
    <nav className="navbar sticky top-0 z-50 bg-[rgba(10,10,25,.55)] backdrop-blur-md border-b border-white/10 px-4 flex items-center gap-4">
      <NavLink end to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/worlds" className={linkClass}>Worlds</NavLink>
      <NavLink to="/zones" className={linkClass}>Zones</NavLink>
      <NavLink to="/marketplace" className={linkClass}>Marketplace</NavLink>
      <button
        className="icon-btn"
        style={{ position: 'relative' }}
        onClick={() => window.dispatchEvent(new CustomEvent('minicart:open'))}
        aria-label="Cart"
      >
        🛒
        {cartQty > 0 && (
          <span className="badge">{cartQty > 9 ? '9+' : cartQty}</span>
        )}
      </button>
      <button
        className="icon-btn"
        style={{ position: 'relative' }}
        onClick={() => navigate('/account/wishlist')}
        aria-label="Wishlist"
      >
        ♥
        {wishCount > 0 && (
          <span className="wishlist-badge">{wishCount > 9 ? '9+' : wishCount}</span>
        )}
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          style={{ background: 'transparent', color: 'inherit', border: '1px solid rgba(255,255,255,.3)', borderRadius: 4 }}
        >
          <option value="light">Light</option>
          <option value="system">System</option>
          <option value="dark">Dark</option>
        </select>
        {user ? (
          <>
            <NavLink to="/account" className={linkClass}>Account</NavLink>
            <NavLink to="/profile" className={linkClass}>
              <div className="avatar-sm">
                {img ? (
                  <img src={img} alt="Me" />
                ) : (
                  <div className="avatar-empty">{user.email?.[0]?.toUpperCase() || 'U'}</div>
                )}
              </div>
            </NavLink>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <NavLink to="/#signin" className={linkClass}>Sign in</NavLink>
        )}
      </div>
    </nav>
  );
}

