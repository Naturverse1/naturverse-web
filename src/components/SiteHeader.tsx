import { useState, useMemo } from "react";
import { Link } from "wouter"; // already in the project
// If your auth util is different, swap the hook below.
import { useSession } from "../lib/session"; // <- falls back to null if not authed

function CartIcon({ count = 0 }: { count?: number }) {
  return (
    <span className="relative inline-flex items-center justify-center w-6 h-6">
      {/* inline svg keeps color consistent across themes */}
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 stroke-blue-600"
        fill="none"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M3 3h2l2.2 12.6a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.7L21 7H6" />
        <circle cx="10" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 rounded-full bg-green-600 text-white text-[10px] leading-4 text-center"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      )}
    </span>
  );
}

export default function SiteHeader() {
  const session = useSession?.() ?? null; // tolerate projects where useSession is optional
  const isAuthed = useMemo(() => Boolean(session), [session]);
  const [menuOpen, setMenuOpen] = useState(false);

  // close menu on route changes if you use wouter elsewhere
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Row: Brand (left) + actions (right) */}
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
            {/* favicon/brand */}
            <img
              src="/favicon-32x32.png"
              alt=""
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-semibold text-blue-700 text-lg">
              The Naturverse
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Cart (simple icon; badge only if > 0) */}
            <Link href="/cart" className="p-2 rounded-md hover:bg-blue-50" onClick={closeMenu} aria-label="Cart">
              <CartIcon count={0} />
            </Link>

            {/* Mobile hamburger (md:hidden) */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative md:hidden p-2 rounded-md hover:bg-blue-50"
            >
              {/* “cracked” hamburger: top + bottom offset */}
              <span className="block h-[2px] w-6 bg-blue-700 translate-y-[1px]"></span>
              <span className="block h-[2px] w-6 bg-blue-700 my-[6px]"></span>
              <span className="block h-[2px] w-6 bg-blue-700 -translate-y-[1px]"></span>
            </button>

            {/* Desktop nav (only when authed) */}
            {isAuthed && (
              <nav className="hidden md:flex items-center gap-6 text-sm text-blue-700">
                <Link href="/worlds" className="hover:underline">Worlds</Link>
                <Link href="/zones" className="hover:underline">Zones</Link>
                <Link href="/marketplace" className="hover:underline">Marketplace</Link>
                <Link href="/wishlist" className="hover:underline">Wishlist</Link>
                <Link href="/naturversity" className="hover:underline">Naturversity</Link>
                <Link href="/naturbank" className="hover:underline">NaturBank</Link>
                <Link href="/navatar" className="hover:underline">Navatar</Link>
                <Link href="/passport" className="hover:underline">Passport</Link>
                <Link href="/turian" className="hover:underline">Turian</Link>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="absolute left-0 right-0 top-0 mx-3 mt-3 rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold text-blue-700">The Naturverse</span>
              <button
                className="p-2 rounded-md hover:bg-blue-50"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-blue-700" fill="none" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <nav className="px-6 pb-4 grid gap-3 text-base text-blue-700">
              <Link href="/worlds" onClick={closeMenu} className="py-2">Worlds</Link>
              <Link href="/zones" onClick={closeMenu} className="py-2">Zones</Link>
              <Link href="/marketplace" onClick={closeMenu} className="py-2">Marketplace</Link>
              <Link href="/wishlist" onClick={closeMenu} className="py-2">Wishlist</Link>
              <Link href="/naturversity" onClick={closeMenu} className="py-2">Naturversity</Link>
              <Link href="/naturbank" onClick={closeMenu} className="py-2">NaturBank</Link>
              <Link href="/navatar" onClick={closeMenu} className="py-2">Navatar</Link>
              <Link href="/passport" onClick={closeMenu} className="py-2">Passport</Link>
              <Link href="/turian" onClick={closeMenu} className="py-2">Turian</Link>
            </nav>
          </div>
        </div>
      )}

      {/* thin divider for mobile only (keeps spacing consistent) */}
      <div className="md:hidden border-t border-blue-100" />
    </header>
  );
}

