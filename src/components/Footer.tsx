import React from "react";
import { FOOTER_LINKS } from "../data/footer";

export default function Footer() {
  return (
    <footer>
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <small>© {new Date().getFullYear()} Naturverse™</small>
        <nav style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {FOOTER_LINKS.map(l => (
            <a key={l.href} href={l.href} className="muted">{l.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
