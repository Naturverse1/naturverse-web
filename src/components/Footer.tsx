import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      className="nv-footer"
      aria-label="Site footer"
    >
      <div className="nv-footer__inner">
        <p className="nv-footer__copy">© {year} Turian Media Company</p>

        <nav aria-label="Footer">
          <ul className="nv-footer__links">
            <li><a href="/privacy" className="nv-footer__link">Privacy Policy</a></li>
            <li><a href="/terms" className="nv-footer__link">Terms</a></li>
            <li><a href="/contact" className="nv-footer__link">Contact</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
