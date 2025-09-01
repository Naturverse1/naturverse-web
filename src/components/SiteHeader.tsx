import { useState, useEffect, useRef } from "react";
import { Link } from "wouter"; // already in repo
import { useSession } from "../lib/session"; // or your existing hook
import CartButton from "./CartButton"; // existing
import cn from "../utils/cn";

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
  const { user } = useSession(); // truthy when authed
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // lock body scroll when menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Brand = (
    <Link href="/" aria-label="The Naturverse home" className="flex items-center gap-2">
      <span className="text-xl md:text-2xl leading-none">🧚‍♂️</span>
      <span className="font-extrabold text-blue-600 md:text-xl">The Naturverse</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Row */}
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Left: Brand */}
          <div className="flex min-w-0 items-center shrink-0">{Brand}</div>

          {/* Desktop nav (auth only) */}
          {user ? (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ) : (
            <div className="hidden lg:block" />
          )}

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <CartButton className="focus:outline-none focus:ring-0" />
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex lg:hidden items-center justify-center w-11 h-10 rounded-md border border-slate-300 text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              {/* cracked hamburger look */}
              <span className="relative block w-5 h-0.5 bg-blue-600 before:absolute before:inset-x-0 before:-top-2 before:h-0.5 before:bg-blue-600 after:absolute after:inset-x-0 after:top-2 after:h-0.5 after:bg-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-slate-900/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          id="mobile-menu"
          ref={panelRef}
          className={cn(
            "absolute left-0 right-0 top-0 mx-4 mt-4 rounded-2xl bg-white shadow-xl overflow-hidden border border-slate-200",
            "transition-transform duration-200 ease-out",
            open ? "translate-y-0" : "-translate-y-6"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            {Brand}
            <button
              className="p-2 rounded-md text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="px-6 py-4 grid gap-4 text-lg font-semibold">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

