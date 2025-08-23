import React from "react";

export default function Footer() {
  return (
    <footer className="footer__wrap">
      <div className="site-footer footer__inner">
        <span className="footer__brand">
          <img src="/favicon.ico" alt="Naturverse" />
          <span>© {new Date().getFullYear()} Naturverse</span>
        </span>
        <nav className="footer-social">
          <a href="https://x.com/turianthedurian" target="_blank" rel="noreferrer">
            X
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="https://discord.gg" target="_blank" rel="noreferrer">
            Discord
          </a>
          <a href="mailto:info@naturverse.com">info@naturverse.com</a>
        </nav>
        <nav className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="/accessibility">Accessibility</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </footer>
  );
}

