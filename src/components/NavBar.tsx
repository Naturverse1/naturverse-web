import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nv-header">
      <div className="nv-header__inner">
        {/* Home link restored (clickable brand) */}
        <Link to="/" className="nv-brand" aria-label="Naturverse Home">
          <img src="/favicon-32x32.png" alt="Turian" className="nv-logo" width="24" height="24" />
          <strong>Naturverse</strong>
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
        <nav id="nv-mobile-menu" className={`nv-nav ${open ? 'is-open' : ''}`}>
          <NavLink to="/worlds" data-topnav>Worlds</NavLink>
          <NavLink to="/zones" data-topnav>Zones</NavLink>
          <NavLink to="/marketplace" data-topnav>Marketplace</NavLink>
          <NavLink to="/naturversity" data-topnav>Naturversity</NavLink>
          <NavLink to="/naturbank" data-topnav>Naturbank</NavLink>
          <NavLink to="/navatar" data-topnav>Navatar</NavLink>
          <NavLink to="/passport" data-topnav>Passport</NavLink>
          <NavLink to="/turian" data-topnav>Turian</NavLink>
          <NavLink to="/profile" data-topnav>Profile</NavLink>
        </nav>
      </div>
    </header>
  );
}
