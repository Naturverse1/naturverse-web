import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nv-header">
      <div className="nv-header__inner">
        <Link to="/" className="brand" aria-label="Naturverse home">
          {/* tiny inline durian logo (no external asset) */}
          <svg
            className="brand__logo"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#84cc16" />
                <stop offset="1" stopColor="#16a34a" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9" fill="url(#g)" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              const x = 12 + Math.cos(a) * 9.6;
              const y = 12 + Math.sin(a) * 9.6;
              return <circle key={i} cx={x} cy={y} r="1" fill="#166534" />;
            })}
            <circle cx="9" cy="11" r="1.2" fill="#14532d" />
            <circle cx="15" cy="11" r="1.2" fill="#14532d" />
            <path d="M8 15c1.5 1 6.5 1 8 0" stroke="#14532d" strokeWidth="1.4" fill="none" />
          </svg>
          <span className="brand__name">Naturverse</span>
        </Link>

        <nav className="nv-nav">
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">Naturbank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
          <Link to="/profile">Profile</Link>
        </nav>

        <button
          type="button"
          className="nv-menu"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nv-drawer" role="menu" onClick={() => setOpen(false)}>
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">Naturbank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
          <Link to="/profile">Profile</Link>
        </div>
      )}
    </header>
  );
}

