"use client";

import { useState } from 'react';
import './SiteHeader.css';
import { useAuth } from '@/lib/auth-context';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import CartDrawer from './CartDrawer';

export default function SiteHeader() {
  const { user, ready } = useAuth();
  if (!ready || !user) return null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="nv-site-header" role="banner">
        <div className="nv-header-inner">
          {/* Brand */}
          <a className="nv-brand" href="/" aria-label="The Naturverse">
            <img className="nv-brand-icon" src="/favicon-64x64.png" alt="" />
            <span className="nv-brand-name">The Naturverse</span>
          </a>

          {/* Desktop nav (auth only) */}
          {
            <nav className="nv-desktop-nav" aria-label="Primary">
              <a href="/worlds">Worlds</a>
              <a href="/zones">Zones</a>
              <a href="/marketplace">Marketplace</a>
              <a href="/marketplace/wishlist">Wishlist</a>
              <a href="/naturversity">Naturversity</a>
              <a href="/naturbank">NaturBank</a>
              <a href="/navatar">Navatar</a>
              <a href="/passport">Passport</a>
              <a href="/turian">Turian</a>
            </nav>
          }

          {/* Right side actions */}
          <div className="nv-actions">
            <CartButton
              className="nv-icon-btn"
              onClick={() => {
                setCartOpen(true);
                setMenuOpen(false);
              }}
            />
            <UserAvatar className="nv-icon-btn" />
            <button
              type="button"
              className="nv-icon-btn nv-hamburger lg-hidden nav-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="nv-mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>

        {/* Mobile overlay menu */}
        <div
          id="nv-mobile-menu"
          className={`nv-mobile-menu ${menuOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          onClick={() => setMenuOpen(false)}
        >
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button
              className="nv-icon-btn close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>

            <nav aria-label="Mobile">
              <a href="/worlds">Worlds</a>
              <a href="/zones">Zones</a>
              <a href="/marketplace">Marketplace</a>
              <a href="/marketplace/wishlist">Wishlist</a>
              <a href="/naturversity">Naturversity</a>
              <a href="/naturbank">NaturBank</a>
              <a href="/navatar">Navatar</a>
              <a href="/passport">Passport</a>
              <a href="/turian">Turian</a>
            </nav>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

