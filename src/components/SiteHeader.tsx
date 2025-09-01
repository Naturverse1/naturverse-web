import { useSession } from '@/lib/session';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import './site-header.css';

export default function SiteHeader() {
  const { user } = useSession(); // truthy when logged in
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    return () => {
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className="nv-header" role="banner">
      <div className="nv-header__inner">
        <Link href="/" className="nv-brand" aria-label="The Naturverse home">
          <img
            className="nv-brand__mark"
            src="/favicon-32x32.png"
            width={20}
            height={20}
            alt=""
            loading="eager"
            decoding="async"
          />
          <span className="nv-brand__text">The Naturverse</span>
        </Link>

        {/* Search is always visible, but size is clamped in CSS */}
        <div className="nv-search">
          <input
            className="nv-search__input"
            type="search"
            placeholder="Search worlds, zones, marketplace, quests"
            aria-label="Search"
          />
        </div>

        {/* Desktop links visible only when authenticated */}
        {user && (
          <nav className="nv-nav nv-nav--desktop" aria-label="Primary">
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
        )}

        {/* Mobile hamburger */}
        <button
          className="nv-menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="nv-menu-btn__lines" aria-hidden="true" />
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="nv-menu-backdrop" onClick={() => setOpen(false)} />
      <aside className="nv-menu-panel" role="dialog" aria-modal="true">
        <button
          className="nv-menu-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        {user && (
          <nav className="nv-nav nv-nav--mobile" aria-label="Primary">
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
        )}
      </aside>
    </header>
  );
}

