import React, { useEffect, useRef, useState } from "react";

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
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click / escape
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand (left) — always links home */}
        <a href="/" aria-label="Naturverse home" className="flex items-center gap-2 shrink-0">
          {/* inline durian glyph (keeps build image-free) */}
          <span aria-hidden className="inline-block h-6 w-6 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
          <span className="font-semibold tracking-tight">Naturverse</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button + dropdown */}
        <div className="relative md:hidden">
          <button
            ref={btnRef}
            type="button"
            aria-label="Open menu"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            <span className="sr-only">Menu</span>
            {/* hamburger */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Compact dropdown under the button (no drawer) */}
          <div
            ref={menuRef}
            role="menu"
            aria-label="Main"
            className={`absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg ${
              open ? "block" : "hidden"
            }`}
          >
            <ul className="py-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="block px-3 py-2 text-slate-800 hover:bg-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
