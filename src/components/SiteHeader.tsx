import React from 'react';
import './SiteHeader.css';

type Props = {
  isAuthenticated?: boolean; // pass your existing auth flag into this prop
};

export default function SiteHeader({ isAuthenticated }: Props) {
  return (
    <header className="nv-site-header" role="banner">
      <div className="nv-header-inner">
        <a className="nv-brand" href="/">
          {/* Use PNG to avoid CSS fill/filters changing color */}
          <img className="nv-brand-icon" src="/favicon-32x32.png" alt="" />
          <span className="nv-brand-name">The Naturverse</span>
        </a>

        {/* Desktop navigation (auth-only) */}
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

        {/* Mobile-only actions (kept here but hidden on desktop) */}
        <div className="nv-mobile-actions" aria-hidden="true">
          <button className="nv-icon-btn nv-cart" type="button">
            <span className="nv-sr">Open cart</span>
            🛒
          </button>
          <button className="nv-icon-btn nv-hamburger" type="button">
            <span className="nv-sr">Open menu</span>
            {'☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
