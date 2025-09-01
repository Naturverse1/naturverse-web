"use client";

import { useState } from 'react';
import './SiteHeader.css';
import { useAuth } from '@/lib/auth-context';
import CartButton from './CartButton';
import UserAvatar from './UserAvatar';
import CartDrawer from './CartDrawer';
import MobileNav from './MobileNav';

export default function SiteHeader() {
  const { user } = useAuth();
  const isAuthed = !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header
        className="nv-site-header sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b"
        role="banner"
      >
        <div className="nv-header-inner">
          {/* Brand */}
          <a
            className="nv-brand shrink-0 hover:opacity-80 transition-opacity"
            href="/"
            aria-label="The Naturverse"
          >
            <img className="nv-brand-icon" src="/favicon-64x64.png" alt="" />
            <span className="nv-brand-name">The Naturverse</span>
          </a>

          {isAuthed ? (
            <>
              {/* Desktop nav */}
              <nav className="nv-desktop-nav hidden md:flex items-center gap-6" aria-label="Primary">
                <a href="/worlds" className="hover:opacity-80 transition-opacity">
                  Worlds
                </a>
                <a href="/zones" className="hover:opacity-80 transition-opacity">
                  Zones
                </a>
                <a href="/marketplace" className="hover:opacity-80 transition-opacity">
                  Marketplace
                </a>
                <a href="/wishlist" className="hover:opacity-80 transition-opacity">
                  Wishlist
                </a>
                <a href="/naturversity" className="hover:opacity-80 transition-opacity">
                  Naturversity
                </a>
                <a href="/naturbank" className="hover:opacity-80 transition-opacity">
                  NaturBank
                </a>
                <a href="/navatar" className="hover:opacity-80 transition-opacity">
                  Navatar
                </a>
                <a href="/passport" className="hover:opacity-80 transition-opacity">
                  Passport
                </a>
                <a href="/turian" className="hover:opacity-80 transition-opacity">
                  Turian
                </a>
              </nav>

              {/* Right side actions */}
              <div className="nv-actions hidden md:flex items-center gap-3 md:gap-4">
                <CartButton
                  className="nv-icon-btn hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                />
                <UserAvatar className="nv-icon-btn hover:opacity-80 transition-opacity" />
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="nv-icon-btn nv-hamburger md:hidden nav-toggle hover:opacity-80 transition-opacity"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="nv-mobile-menu"
                onClick={() => setMenuOpen(true)}
              >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </button>
            </>
          ) : null}
        </div>
      </header>

      {isAuthed ? (
        <>
          <MobileNav
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onCartOpen={() => setCartOpen(true)}
          />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
      ) : null}
    </>
  );
}

