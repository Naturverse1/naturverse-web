import { Link } from "wouter";

type LinkItem = { href: string; label: string };

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: LinkItem[];
}) {
  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        className={`absolute left-0 right-0 top-0 mx-3 mt-2 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden transition-transform duration-200 ${
          open ? "translate-y-0" : "-translate-y-6"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <img src="/favicon-32x32.png" alt="" width={20} height={20} />
            <span className="font-semibold text-blue-600">The Naturverse</span>
          </div>
          <button
            aria-label="Close menu"
            className="rounded-full border border-slate-300 w-8 h-8 grid place-items-center bg-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="px-4 py-3 grid gap-3">
          {links.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Sign in to see navigation.
            </p>
          ) : (
            links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800"
                onClick={onClose}
              >
                {l.label}
              </Link>
            ))
          )}
        </nav>
      </div>
    </div>
  );
}

