import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import './site-header.css';
import AuthButton from './AuthButton';
import CartButton from './CartButton';
import WalletConnect from './WalletConnect';
import ProfileMini from './ProfileMini';

export default function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header ${user ? 'is-authed' : ''}`}>
      <a href="/" className="brand">The Naturverse</a>

      {/* Hamburger (mobile always; desktop authed-only via CSS) */}
      <button
        aria-label="Open menu"
        className="hamburger"
        onClick={() => setOpen(true)}
      >
        <span className="hamburger__lines" />
      </button>

      {/* Search */}
      <div className="site-header__rail" style={{ flex: 1, minWidth: 0 }}>
        <input
          className="header-search"
          type="search"
          placeholder="Search worlds, zones, marketplace, quests"
        />
      </div>

      {/* … existing wallet/cart/etc … */}
      <AuthButton />
      <ProfileMini />
      <WalletConnect />
      <CartButton />

      {/* Mobile menu sheet */}
      {open && (
        <div role="dialog" aria-modal="true" className="mobile-menu">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="mobile-menu__close">×</button>
          {/* your existing menu links */}
        </div>
      )}
    </header>
  );
}

