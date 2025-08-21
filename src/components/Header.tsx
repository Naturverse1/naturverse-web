import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nv-header">
      <div className="nv-header__inner">
        {/* Logo → always takes you Home */}
        <Link to="/" className="nv-brand" aria-label="Naturverse — Home">
          <span className="nv-brand__leaf">🌿</span>
          <span className="nv-brand__text">Naturverse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nv-nav nv-nav--desktop" aria-label="Primary">
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

        {/* Mobile menu button */}
        <button
          type="button"
          className="nv-menu-btn"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* 3-bars icon that actually works */}
          <span className="nv-menu-btn__bar" />
          <span className="nv-menu-btn__bar" />
          <span className="nv-menu-btn__bar" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="nv-drawer" role="dialog" aria-modal="true">
          <nav className="nv-nav nv-nav--mobile" onClick={() => setOpen(false)}>
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
          <button
            type="button"
            className="nv-drawer__scrim"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </header>
  );
}

