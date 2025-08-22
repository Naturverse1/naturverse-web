import React, { useEffect, useState } from "react";

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

  // close drawer on route change (hash/path)
  useEffect(() => {
    const onChange = () => setOpen(false);
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  // close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="nv-header">
      <div className="nv-shell">
        <a href="/" className="nv-brand" aria-label="Naturverse home">
          <span className="nv-logo" aria-hidden="true">🌿</span>
          <span className="nv-name">Naturverse</span>
        </a>

        {/* desktop nav */}
        <nav className="nv-nav">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* mobile button */}
        <button
          className="nv-burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span/>
          <span/>
          <span/>
        </button>

        {/* mobile drawer */}
        {open && (
          <div className="nv-drawer" role="dialog" aria-modal="true">
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
