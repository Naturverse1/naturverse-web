import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="nv-header">
      <div className="nv-wrap">
        <Link to="/" className="nv-brand">
          <img src="/favicon-32x32.png" alt="Naturverse" width={28} height={28} />
          <span className="nv-brand-text">Naturverse</span>
        </Link>

        <nav className="nv-nav" aria-label="Main">
          <NavLink to="/worlds" className="nv-link">Worlds</NavLink>
          <NavLink to="/zones" className="nv-link">Zones</NavLink>
          <NavLink to="/marketplace" className="nv-link">Marketplace</NavLink>
          <NavLink to="/naturversity" className="nv-link">Naturversity</NavLink>
          <NavLink to="/naturbank" className="nv-link">Naturbank</NavLink>
          <NavLink to="/navatar" className="nv-link">Navatar</NavLink>
          <NavLink to="/passport" className="nv-link">Passport</NavLink>
          <NavLink to="/turian" className="nv-link">Turian</NavLink>
        </nav>

        <div className="nv-actions">
          <NavLink to="/profile" className="nv-icon" aria-label="Profile">👤</NavLink>
          <NavLink to="/cart" className="nv-icon" aria-label="Cart">🛒</NavLink>
        </div>
      </div>
    </header>
  );
}
