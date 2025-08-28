import React from "react";
import { BUILD_TIME_ISO, BRANCH, RELEASE } from "../version";

export default function Footer() {
  const year = new Date().getFullYear();

  // Existing footer UI...
  return (
    <footer role="contentinfo" className="nv-footer" aria-label="Site footer">
      <div className="nv-footer__inner">
        <p className="nv-footer__copy">© {year} Turian Media Company</p>

        <nav aria-label="Footer">
          <ul className="nv-footer__links">
            <li><a href="/privacy" className="nv-footer__link">Privacy Policy</a></li>
            <li><a href="/terms" className="nv-footer__link">Terms</a></li>
            <li><a href="/contact" className="nv-footer__link">Contact</a></li>
          </ul>
        </nav>

        <small className="nv-footer__ver" aria-label="Build version">
          {RELEASE ? `v${RELEASE} · ` : ""}{BRANCH} · {new Date(BUILD_TIME_ISO).toLocaleString()}
        </small>
      </div>
    </footer>
  );
}
