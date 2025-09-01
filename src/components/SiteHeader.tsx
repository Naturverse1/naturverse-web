import { useState, useEffect, useRef } from 'react';
import { useSession } from '@/lib/session';
import { Link } from 'wouter';
import './site-header.css';

export default function SiteHeader() {
  const { user } = useSession(); // truthy when logged in
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on escape / outside click
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // lock body scroll when open
  useEffect(() => {
    const { body } = document;
    if (!body) return;
    const prev = body.style.overflow;
    body.style.overflow = open ? 'hidden' : prev || '';
    return () => {
      body.style.overflow = prev || '';
    };
  }, [open]);

  const navLinks = (
    <nav className="nv-nav-links">
      <Link href="/worlds">Worlds</Link>
      <Link href="/zones">Zones</Link>
      <Link href="/marketplace">Marketplace</Link>
      <Link href="/wishlist">Wishlist</Link>
      <Link href="/naturversity">Naturversity</Link>
      <Link href="/naturbank">NaturBank</Link>
      <Link href="/navatar">Navatar</Link>
      <Link href="/passport">Passport</Link>
      <Link href="/turian">Turian</Link>
    </nav>
  );

  return (
    <header className="nv-header">
      <div className="nv-header-inner">
        <Link href="/" className="nv-brand">
          <img
            src="/favicon-32x32.png"
            alt=""
            width="24"
            height="24"
            className="nv-brand-icon"
          />
          <span className="nv-brand-text">The Naturverse</span>
        </Link>

        {/* Desktop nav: only when logged-in */}
        {user ? <div className="nv-desktop-only">{navLinks}</div> : <div />}

        {/* Mobile actions */}
        <button
          className="nv-hamburger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="nv-menu-overlay" role="dialog" aria-modal="true">
          <div className="nv-menu-panel" ref={panelRef}>
            <button
              className="nv-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
}

