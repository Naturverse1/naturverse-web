import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import CartButton from './CartButton';
import './site-header.css';
import './mobile-menu.css';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // lock body scroll when sheet is open
  useEffect(() => {
    const { body } = document;
    const prev = body.style.overflow;
    if (open) body.style.overflow = 'hidden';
    else body.style.overflow = prev || '';
    return () => (body.style.overflow = prev || '');
  }, [open]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // close when clicking outside the sheet
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-row">
        <Link to="/" className="nv-brand">
          <img className="nv-logo" src="/logo.svg" alt="" aria-hidden="true" />
          <span className="nv-brand__text">The Naturverse</span>
        </Link>
        <div className="header-actions">
          {user && (
            <nav className="desktop-nav">
              <Link to="/worlds">Worlds</Link>
              <Link to="/zones">Zones</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/naturversity">Naturversity</Link>
              <Link to="/naturbank">NaturBank</Link>
              <Link to="/navatar">Navatar</Link>
              <Link to="/passport">Passport</Link>
              <Link to="/turian">Turian</Link>
            </nav>
          )}
          <CartButton />
          <button
            className={`hamburger ${open ? 'hamburger--open' : ''}`}
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* mobile menu overlay */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        className={`mobile-menu-panel ${open ? 'is-open' : ''}`}
        role="menu"
      >
        <button
          className="mobile-menu-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <nav>
          <Link to="/worlds" role="menuitem" onClick={() => setOpen(false)}>
            Worlds
          </Link>
          <Link to="/zones" role="menuitem" onClick={() => setOpen(false)}>
            Zones
          </Link>
          <Link to="/marketplace" role="menuitem" onClick={() => setOpen(false)}>
            Marketplace
          </Link>
          <Link to="/wishlist" role="menuitem" onClick={() => setOpen(false)}>
            Wishlist
          </Link>
          <Link to="/naturversity" role="menuitem" onClick={() => setOpen(false)}>
            Naturversity
          </Link>
          <Link to="/naturbank" role="menuitem" onClick={() => setOpen(false)}>
            NaturBank
          </Link>
          <Link to="/navatar" role="menuitem" onClick={() => setOpen(false)}>
            Navatar
          </Link>
          <Link to="/passport" role="menuitem" onClick={() => setOpen(false)}>
            Passport
          </Link>
          <Link to="/turian" role="menuitem" onClick={() => setOpen(false)}>
            Turian
          </Link>
        </nav>
      </div>
    </header>
  );
}
