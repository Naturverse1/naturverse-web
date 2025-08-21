import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const nav = [
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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand is now a home link */}
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Naturverse home">
          <img src="/turian.svg" alt="Naturverse" className="h-6 w-6" />
          <span className="font-semibold tracking-tight">Naturverse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "rounded-md px-3 py-1.5 text-sm " +
                (isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile button (now a real, accessible button) */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-menu" className={`md:hidden border-t border-slate-200 ${open ? "block" : "hidden"}`}>
        <nav className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-2 gap-2">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                "rounded-md px-3 py-2 text-sm text-center " +
                (isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

