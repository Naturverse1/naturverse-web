"use client";

import { useState } from 'react';
import './SiteHeader.css';
import { useAuth } from '@/lib/auth-context';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import CartDrawer from './CartDrawer';
import MobileNav from './MobileNav';

export default function SiteHeader() {
  const { user, ready } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  if (!ready) return null;

  const HeaderContent = () => (
    <>
      <header className="nv-site-header" role="banner">
        <div className="nv-header-inner">
          {/* Brand */}
          <a
            className="nv-brand hover:opacity-80 transition-opacity"
            href="/"
            aria-label="The Naturverse"
          >
            <img className="nv-brand-icon" src="/favicon-64x64.png" alt="" />
            <span className="nv-brand-name">The Naturverse</span>
          </a>

          {/* Desktop nav (auth only) */}
          {
            <nav className="nv-desktop-nav" aria-label="Primary">
              <a href="/worlds">Worlds</a>
              <a href="/zones">Zones</a>
              <a href="/marketplace">Marketplace</a>
              <a href="/wishlist">Wishlist</a>
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
              className="nv-icon-btn mobile-hidden"
              onClick={() => {
                setCartOpen(true);
                setMenuOpen(false);
              }}
            />
            <UserAvatar className="nv-icon-btn mobile-hidden" />
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
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );

  return <>{user ? <HeaderContent /> : null}</>;
}

