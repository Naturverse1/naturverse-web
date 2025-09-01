import { useState } from "react";
import { Link } from "wouter"; // Make sure step 3 is done
import { useSession } from "@/lib/session"; // whatever you already use
import CartButton from "@/components/CartButton";

export default function SiteHeader() {
  const { user } = useSession();
  const isAuthed = !!user;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/favicon-32x32.png"
              alt=""
              className="h-6 w-6 rounded"
              loading="eager"
            />
            <span className="text-blue-600 font-extrabold tracking-tight">
              The Naturverse
            </span>
          </Link>

          {/* Desktop nav (ONLY when authed) */}
          {isAuthed && (
            <nav className="hidden lg:flex items-center gap-6 text-[15px]">
              <Link href="/worlds" className="hover:opacity-80">Worlds</Link>
              <Link href="/zones" className="hover:opacity-80">Zones</Link>
              <Link href="/marketplace" className="hover:opacity-80">Marketplace</Link>
              <Link href="/wishlist" className="hover:opacity-80">Wishlist</Link>
              <Link href="/naturversity" className="hover:opacity-80">Naturversity</Link>
              <Link href="/naturbank" className="hover:opacity-80">NaturBank</Link>
              <Link href="/navatar" className="hover:opacity-80">Navatar</Link>
              <Link href="/passport" className="hover:opacity-80">Passport</Link>
              <Link href="/turian" className="hover:opacity-80">Turian</Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <CartButton />

            {/* Hamburger (mobile / tablet only) */}
            <button
              type="button"
              aria-label="Open menu"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-md ring-1 ring-black/10"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-50" id="mobile-menu">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-3 top-3 rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-blue-600 font-extrabold">The Naturverse</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-md ring-1 ring-black/10"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <nav className="px-6 pb-6 pt-2 grid gap-4 text-lg">
              <Link href="/worlds" onClick={() => setOpen(false)}>Worlds</Link>
              <Link href="/zones" onClick={() => setOpen(false)}>Zones</Link>
              <Link href="/marketplace" onClick={() => setOpen(false)}>Marketplace</Link>
              <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
              <Link href="/naturversity" onClick={() => setOpen(false)}>Naturversity</Link>
              <Link href="/naturbank" onClick={() => setOpen(false)}>NaturBank</Link>
              <Link href="/navatar" onClick={() => setOpen(false)}>Navatar</Link>
              <Link href="/passport" onClick={() => setOpen(false)}>Passport</Link>
              <Link href="/turian" onClick={() => setOpen(false)}>Turian</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

