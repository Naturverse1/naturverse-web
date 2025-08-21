import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nv-header">
      <div className="nv-container nv-nav-row">
        {/* BRAND — always links Home */}
        <Link to="/" className="nv-brand">
          {/* optional brand mark (hidden if missing) */}
          <img
            src="/assets/turian-media-logo.png"
            alt="Turian Media Company"
            className="nv-brand-mark"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="nv-brand-title">Naturverse</span>
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="nv-nav-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="nv-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nv-burger" />
        </button>

        {/* LINKS */}
        <nav
          id="nv-mobile-menu"
          className={`nv-nav ${open ? 'is-open' : ''}`}
        >
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/naturbank">Naturbank</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/passport">Passport</NavLink>
          <NavLink to="/turian">Turian</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}
