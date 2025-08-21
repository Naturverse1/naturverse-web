import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nv-header">
      <div className="nv-header__row">
        <Link href="/" className="nv-brand" aria-label="Naturverse home">
          <span className="nv-brand__mark" aria-hidden>🌿</span>
          <span className="nv-brand__name">Naturverse</span>
        </Link>
        <nav className="nv-nav nv-nav--desktop" aria-label="Primary">
          <Link href="/worlds">Worlds</Link>
          <Link href="/zones">Zones</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/naturversity">Naturversity</Link>
          <Link href="/naturbank">Naturbank</Link>
          <Link href="/navatar">Navatar</Link>
          <Link href="/passport">Passport</Link>
          <Link href="/turian">Turian</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        {/* batch-286 mobile: small apps button, not hamburger */}
        <button type="button" className="nv-nav__apps" aria-label="Menu" onClick={() => setOpen(v=>!v)}>▢</button>
      </div>
      {open && (
        <nav className="nv-nav nv-nav--mobile" aria-label="Mobile">
          <Link href="/worlds" onClick={()=>setOpen(false)}>Worlds</Link>
          <Link href="/zones" onClick={()=>setOpen(false)}>Zones</Link>
          <Link href="/marketplace" onClick={()=>setOpen(false)}>Marketplace</Link>
          <Link href="/naturversity" onClick={()=>setOpen(false)}>Naturversity</Link>
          <Link href="/naturbank" onClick={()=>setOpen(false)}>Naturbank</Link>
          <Link href="/navatar" onClick={()=>setOpen(false)}>Navatar</Link>
          <Link href="/passport" onClick={()=>setOpen(false)}>Passport</Link>
          <Link href="/turian" onClick={()=>setOpen(false)}>Turian</Link>
          <Link href="/profile" onClick={()=>setOpen(false)}>Profile</Link>
        </nav>
      )}
    </header>
  );
}
