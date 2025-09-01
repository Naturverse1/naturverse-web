import { useMemo, useState } from "react";
import { Link } from "wouter"; // already in project
import { useSession } from "@supabase/auth-helpers-react"; // already used elsewhere
import CartButton from "./CartButton"; // existing
import MobileMenu from "./MobileMenu"; // new/updated below
import "../styles/header.css"; // new tiny CSS for cracked icon

const NAV_LINKS = [
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

export default function SiteHeader() {
  const session = useSession();
  const isAuthed = useMemo(() => Boolean(session), [session]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/favicon-32x32.png"
              alt=""
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-semibold text-blue-600 text-lg leading-none">
              The Naturverse
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <CartButton />

            {/* Hamburger (mobile only) */}
            <button
              aria-label="Open menu"
              className={`md:hidden cracked-hamburger rounded-full border border-slate-300 bg-white w-11 h-8 relative shadow-sm active:scale-[.98]`}
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>

        {/* Desktop nav (auth only) */}
        {isAuthed && (
          <nav className="hidden md:flex gap-6 pb-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={isAuthed ? NAV_LINKS : []}
      />
    </header>
  );
}

