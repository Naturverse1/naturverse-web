import React from "react";
import { FOOTER_LINKS } from "../data/footer";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <small style={{ color: "var(--nv-blue-600)" }}>
          © {new Date().getFullYear()} Naturverse™
        </small>
        <nav style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {FOOTER_LINKS.map(l => (
            <a key={l.href} href={l.href} className="muted">{l.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
