import React, { useState } from "react";

const LINKS = [
  { href: "/worlds", label: "Worlds" },
  { href: "/zones", label: "Zones" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/naturversity", label: "Naturversity" },
  { href: "/naturbank", label: "Naturbank" },
  { href: "/navatar", label: "Navatar" },
  { href: "/passport", label: "Passport" },
  { href: "/turian", label: "Turian" },
  { href: "/profile", label: "Profile" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Brand (left) — links home */}
        <a href="/" className="brand" aria-label="Naturverse home">
          <span className="brand__logo" aria-hidden="true">
            {/* inline durian dot — tiny, not the big face */}
            <svg width="22" height="22" viewBox="0 0 24 24" role="img">
              <defs>
                <linearGradient id="dv" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#34d399" />
                  <stop offset="1" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#dv)" />
              <path d="M6 12l3-3m9 0l-3 3m-6 6l3-3m3 3l-3-3" stroke="#065f46" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="brand__name">Naturverse</span>
        </a>

        {/* Desktop nav (right) */}
        <nav className="main-nav md:flex hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="main-nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle (right) */}
        <button
          type="button"
          className="hamburger md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu md:hidden ${open ? "open" : ""}`} role="menu">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="mobile-menu__link"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  );
}

