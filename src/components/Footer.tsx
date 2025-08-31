import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="nv-footer" role="contentinfo">
      <div className="nv-footer__inner">
        <div className="nv-footer__brand">
          <span>© {new Date().getFullYear()} Naturverse</span>
        </div>

        <nav className="nv-footer__links" aria-label="Legal">
          <a href="/terms" className="nv-footer__link">Terms</a>
          <a href="/privacy" className="nv-footer__link">Privacy</a>
          <a href="/contact" className="nv-footer__link">Contact</a>
        </nav>

        <nav className="nv-footer__social" aria-label="Social">
          <a href="https://x.com/Naturverse" target="_blank" rel="noopener" aria-label="X (Twitter)">X</a>
          <a href="https://instagram.com/Naturverse" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
          <a href="https://youtube.com/@Naturverse" target="_blank" rel="noopener" aria-label="YouTube">YouTube</a>
          <a href="https://tiktok.com/@Naturverse" target="_blank" rel="noopener" aria-label="TikTok">TikTok</a>
        </nav>
      </div>
    </footer>
  );
}
