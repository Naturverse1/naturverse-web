import React, { useState } from "react";
import { Link } from "react-router-dom";

const links = [
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link className="flex items-center gap-2 shrink-0" aria-label="Naturverse home" to="/">
          <span className="font-semibold tracking-tight">Naturverse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 top-inline-nav">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden relative">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border px-3 py-2"
          >
            <span className="sr-only">Menu</span>
            {/* simple hamburger */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div role="menu" className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg p-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
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

