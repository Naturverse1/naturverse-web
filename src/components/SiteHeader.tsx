import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './site-header.css';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

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
    <header className="nv-header">
      <div className="nv-header__row">
        <Link to="/" className="nv-brand">
          <img className="nv-logo" src="/logo.svg" alt="" aria-hidden="true" />
          <span className="nv-brand__text">The Naturverse</span>
        </Link>

        <button
          className={`nv-burger ${open ? 'nv-burger--open' : ''}`}
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

      {/* slide-down sheet */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        className={`nv-sheet ${open ? 'is-open' : ''}`}
        role="menu"
      >
        <nav className="nv-sheet__nav">
          <Link to="/worlds" role="menuitem" onClick={() => setOpen(false)}>Worlds</Link>
          <Link to="/zones" role="menuitem" onClick={() => setOpen(false)}>Zones</Link>
          <Link to="/marketplace" role="menuitem" onClick={() => setOpen(false)}>Marketplace</Link>
          <Link to="/wishlist" role="menuitem" onClick={() => setOpen(false)}>Wishlist</Link>
          <Link to="/naturversity" role="menuitem" onClick={() => setOpen(false)}>Naturversity</Link>
          <Link to="/naturbank" role="menuitem" onClick={() => setOpen(false)}>NaturBank</Link>
          <Link to="/navatar" role="menuitem" onClick={() => setOpen(false)}>Navatar</Link>
          <Link to="/passport" role="menuitem" onClick={() => setOpen(false)}>Passport</Link>
          <Link to="/turian" role="menuitem" onClick={() => setOpen(false)}>Turian</Link>
        </nav>
      </div>
    </header>
  );
}
