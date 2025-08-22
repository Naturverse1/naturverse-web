import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <img
          src="/Turianmedia-logo-footer.png"
          alt="Turian Media"
          className="footer__brand"
          height={24}
          width={100}
        />

        <nav className="footer__social">
          <a href="https://x.com/turianthedurian" target="_blank" rel="noreferrer">X</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://discord.gg" target="_blank" rel="noreferrer">Discord</a>
          <a href="mailto:info@naturverse.com">info@naturverse.com</a>
        </nav>
      </div>

      <nav className="footer__right">
        <span>© 2025 Naturverse</span>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
        <a href="/contact">Contact</a>
        <a href="/accessibility">Accessibility</a>
        <a href="/about">About</a>
      </nav>
    </footer>
  );
}
