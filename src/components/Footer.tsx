import React from "react";
import ImageSmart from "./ImageSmart";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand" aria-label="A Turian Media Company">
        <ImageSmart
          src="/Turianmedia-logo-footer.png"
          alt="A Turian Media Company"
          width={120}
          height={28}
        />
      </div>
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

