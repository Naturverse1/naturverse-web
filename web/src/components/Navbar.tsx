import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-active' : undefined;

export default function Navbar() {
  const { user, signOut } = useAuth();

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
      <NavLink to="/marketplace/cart" className={linkClass}>Cart</NavLink>
      <NavLink to="/marketplace/orders" className={linkClass}>Orders</NavLink>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
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

