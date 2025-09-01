import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useSession } from "@/lib/session";
import CartButton from "./CartButton";
import VisuallyHidden from "./VisuallyHidden";
import "./site-header.css";

export default function SiteHeader() {
  const { user } = useSession();
  const isAuthenticated = !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const links = [
    { href: "/worlds", label: "Worlds" },
    { href: "/zones", label: "Zones" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/naturversity", label: "Naturversity" },
    { href: "/naturbank", label: "NaturBank" },
    { href: "/navatar", label: "Navatar" },
    { href: "/passport", label: "Passport" },
    { href: "/turian", label: "Turian" },
  ];

  return (
    <header className="site-header">
      <div className="container header-row">
        {/* BRAND */}
        <Link href="/" className="brand" aria-label="The Naturverse">
          <img src="/favicon-32x32.png" alt="" />
          <span className="brand-text">The Naturverse</span>
        </Link>

        {/* RIGHT ACTIONS (cart, hamburger, etc.) */}
        <div className="header-actions">
          <CartButton />
          <button
            type="button"
            className="hamburger"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <VisuallyHidden>Open menu</VisuallyHidden>
          </button>
        </div>
      </div>

      {/* DESKTOP NAV (auth-gated; unchanged behavior) */}
      {isAuthenticated && (
        <nav className="desktop-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      {/* MOBILE MENU PORTAL */}
      {menuOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="mobile-menu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
          >
            <div className="menu-head">
              <button
                className="close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <ul className="menu-list">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
