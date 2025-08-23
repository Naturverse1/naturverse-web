import React, { useEffect, useState } from 'react';
import CartButton from './cart/CartButton';
import Img from './Img';
import { useAuthUser } from '../lib/useAuthUser';
import UserChip from './UserChip';

const LINKS = [
  { href: '/worlds', label: 'Worlds' },
  { href: '/zones', label: 'Zones' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/naturversity', label: 'Naturversity' },
  { href: '/naturbank', label: 'Naturbank' },
  { href: '/navatar', label: 'Navatar' },
  { href: '/passport', label: 'Passport' },
  { href: '/turian', label: 'Turian' },
  { href: '/profile', label: 'Profile' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuthUser();

  // close drawer on route change (hash/path)
  useEffect(() => {
    const onChange = () => setOpen(false);
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);

  // close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="nv-header">
      <div className="nv-shell">
        <a href="/" className="header-logo-link" aria-label="Naturverse home">
          <Img src="/Turianmedia-logo-footer.png" alt="Turian Media" className="site-logo" n />
          <span className="site-title">Naturverse</span>
        </a>

        <div className="nv-right">
          {/* desktop nav */}
          <nav className="nv-nav">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CartButton />
            {loading ? (
              <span style={{ opacity: 0.7 }}>…</span>
            ) : user ? (
              <UserChip email={user.email} />
            ) : (
              <a className="btn" href="/login">Sign in</a>
            )}
          </nav>

          {/* mobile button */}
          <button
            className="nv-burger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="nv-drawer" role="dialog" aria-modal="true">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
