'use client';

import React, { useState } from 'react';
import './SiteHeader.css';
import { useAuth } from '@/lib/auth-context';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import CartDrawer from './CartDrawer';

export default function SiteHeader() {
  const { ready, user } = useAuth();
  const isAuthenticated = ready && !!user;
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="nv-site-header" role="banner">
        <div className="nv-header-inner container">
          <a className="nv-brand" href="/">
            {/* Use PNG to avoid CSS fill/fill-rule issues */}
            <img className="nv-brand-icon" src="/favicon-64x64.png" alt="" />
            <span className="nv-brand-name">The Naturverse</span>
          </a>

          {/* Desktop navigation — auth only */}
          {isAuthenticated && (
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
          )}

          <div className="nv-right">
            {/* Small icon button; badge only when > 0 */}
            <CartButton onClick={() => setCartOpen(true)} />
            {isAuthenticated && <UserAvatar />}
          </div>

          {/* Mobile-only actions remain as-is (hidden on desktop via CSS) */}
          <div className="nv-mobile-actions">
            <button
              className="nv-icon-btn"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <span className="nv-sr">Open cart</span>
            </button>
            <button className="nv-icon-btn" aria-label="Open menu" data-menu>
              <span className="nv-sr">Open menu</span>
              {'≡'}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

