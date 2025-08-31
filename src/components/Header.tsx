import { Link } from "react-router-dom";
import { Container } from "./Container";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Naturverse" className="h-7 w-7" />
          <span className="text-xl font-semibold">Naturverse</span>
        </Link>

        {/* Search (hide on very small) */}
        <div className="hidden sm:block grow max-w-md mx-auto">{/* <SearchBar/> */}</div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* <UserButton/> <CartButton/> */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border"
            aria-label="Open menu"
          >
            ⋮⋮⋮
          </button>
        </div>
      </Container>

      {/* Link row only on desktop/tablet */}
      <nav className="hidden border-t md:block">
        <Container className="flex items-center gap-4">{/* <NavLinks/> */}</Container>
      </nav>
    </header>
  );
}

