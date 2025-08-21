import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/** Central list of site links */
const LINKS = [
  { to: "/worlds", label: "Worlds" },
  { to: "/zones", label: "Zones" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/naturversity", label: "Naturversity" },
  { to: "/naturbank", label: "Naturbank" },
  { to: "/navatar", label: "Navatar" },
  { to: "/passport", label: "Passport" },
  { to: "/turian", label: "Turian" },
  { to: "/profile", label: "Profile" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // close when clicking outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <header className="nv-header" aria-label="Primary">
      <div className="nv-header__inner">
        {/* Brand — always goes home */}
        <Link to="/" className="nv-brand" aria-label="Naturverse home">
          <span className="nv-brand__leaf" aria-hidden>🌿</span>
          <span className="nv-brand__text">Naturverse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nv-nav">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="nv-link">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="nv-menu" ref={menuRef}>
          <button
            type="button"
            className="nv-menu__btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nv-menu__bars" />
          </button>

          {open && (
            <div className="nv-menu__sheet" role="menu">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  role="menuitem"
                  className="nv-menu__item"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
