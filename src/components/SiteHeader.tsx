import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import './site-header.css';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll when open
  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [menuOpen]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="siteHeader">
        <Link to="/" className="nv-brand">
          <img className="nv-logo" src="/logo.svg" alt="" aria-hidden="true" />
          <span className="nv-brand__text">The Naturverse</span>
        </Link>
        <div className="search">
          <SearchBar />
        </div>
        <button
          className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <>
          <div className="mmenuBackdrop" onClick={() => setMenuOpen(false)} />
          <div className="mmenuPanel" id="mobile-menu" role="menu">
            <button
              className="mmenuClose"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav>
              <Link to="/worlds" role="menuitem" onClick={() => setMenuOpen(false)}>
                Worlds
              </Link>
              <Link to="/zones" role="menuitem" onClick={() => setMenuOpen(false)}>
                Zones
              </Link>
              <Link to="/marketplace" role="menuitem" onClick={() => setMenuOpen(false)}>
                Marketplace
              </Link>
              <Link to="/wishlist" role="menuitem" onClick={() => setMenuOpen(false)}>
                Wishlist
              </Link>
              <Link to="/naturversity" role="menuitem" onClick={() => setMenuOpen(false)}>
                Naturversity
              </Link>
              <Link to="/naturbank" role="menuitem" onClick={() => setMenuOpen(false)}>
                NaturBank
              </Link>
              <Link to="/navatar" role="menuitem" onClick={() => setMenuOpen(false)}>
                Navatar
              </Link>
              <Link to="/passport" role="menuitem" onClick={() => setMenuOpen(false)}>
                Passport
              </Link>
              <Link to="/turian" role="menuitem" onClick={() => setMenuOpen(false)}>
                Turian
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

