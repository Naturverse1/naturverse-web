import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-active' : undefined;

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const { items } = useCart();
  const { theme, setTheme } = useTheme();

  const cartQty = items.reduce((sum, i) => sum + i.qty, 0);

  const navatar = (() => {
    try {
      return localStorage.getItem('navatar_url');
    } catch {
      return null;
    }
  })();

  return (
    <nav className="navbar sticky top-0 z-50 bg-[rgba(10,10,25,.55)] backdrop-blur-md border-b border-white/10 px-4 flex items-center gap-4">
      <NavLink end to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/worlds" className={linkClass}>Worlds</NavLink>
      <NavLink to="/zones" className={linkClass}>Zones</NavLink>
      <NavLink to="/marketplace" className={linkClass}>Marketplace</NavLink>
      <NavLink to="/marketplace/orders" className={linkClass}>Orders</NavLink>
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
        onClick={() => navigate('/marketplace/wishlist')}
        aria-label="Wishlist"
      >
        ♥
        {ids.length > 0 && (
          <span className="badge">{ids.length > 9 ? '9+' : ids.length}</span>
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
            <NavLink to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }} className={linkClass}>
              {navatar ? (
                <img
                  src={navatar}
                  alt="Navatar"
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,.12)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                  }}
                >
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span>Profile</span>
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

