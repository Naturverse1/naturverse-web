import React from "react";

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M18.244 3H21l-6.563 7.5L22 21h-5.5l-4.3-5.4L7.2 21H3l6.9-7.9L2 3h5.6l4 5.2L18.244 3Zm-1.926 16h1.433L7.767 4.96H6.267L16.318 19Z"/>
  </svg>
);

const IconIG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 16.8 2.8 2.8 0 0 0 12 9.2Zm5.7-2.2a1.1 1.1 0 1 1 0 2.2a1.1 1.1 0 0 1 0-2.2Z"/>
  </svg>
);

const IconYT = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M23 12s0-3.6-.46-5.28a3.24 3.24 0 0 0-2.28-2.28C18.58 4 12 4 12 4s-6.58 0-8.26.44a3.24 3.24 0 0 0-2.28 2.28C1 8.4 1 12 1 12s0 3.6.46 5.28a3.24 3.24 0 0 0 2.28 2.28C5.42 20 12 20 12 20s6.58 0 8.26-.44a3.24 3.24 0 0 0 2.28-2.28C23 15.6 23 12 23 12ZM10 15.5v-7l6 3.5l-6 3.5Z"/>
  </svg>
);

const IconDiscord = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3l-.2.38a18.27 18.27 0 0 1 3.386 1.4a14.3 14.3 0 0 0-10.488 0A18.27 18.27 0 0 1 12.642 3l-.2-.38a19.786 19.786 0 0 0-3.76 1.37C4.78 6.39 3.53 9.27 3.77 12.09c1.4 1.03 2.746 1.66 4.03 1.99c.326-.45.617-.93.87-1.43c-.48-.18-.94-.41-1.38-.67c.114-.09.227-.18.335-.27c2.644 1.24 5.515 1.24 8.14 0c.11.09.222.18.335.27c-.44.26-.9.49-1.38.67c.253.5.544.98.87 1.43c1.285-.33 2.63-.96 4.03-1.99c.3-3.43-1.07-6.29-3.61-7.72ZM9.68 12.62c-.78 0-1.42-.73-1.42-1.63s.63-1.63 1.42-1.63s1.42.73 1.42 1.63s-.63 1.63-1.42 1.63Zm4.64 0c-.78 0-1.42-.73-1.42-1.63s.63-1.63 1.42-1.63s1.42.73 1.42 1.63s-.64 1.63-1.42 1.63Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="brand">© {new Date().getFullYear()} Naturverse · A Turian Media Company</p>
        <nav className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="/accessibility">Accessibility</a>
          <a href="/about">About</a>
        </nav>
        <nav className="footer-socials" aria-label="Social links">
          <a href="https://x.com/turianthedurian" target="_blank" rel="noreferrer" aria-label="X / Twitter">
            <IconX />
            <span>@turianthedurian</span>
          </a>
          <a href="https://instagram.com/naturverse" target="_blank" rel="noreferrer" aria-label="Instagram">
            <IconIG /><span>Instagram</span>
          </a>
          <a href="https://youtube.com/@naturverse" target="_blank" rel="noreferrer" aria-label="YouTube">
            <IconYT /><span>YouTube</span>
          </a>
          <a href="https://discord.gg/naturverse" target="_blank" rel="noreferrer" aria-label="Discord">
            <IconDiscord /><span>Discord</span>
          </a>
          <a href="mailto:info@naturverse.com" aria-label="Email">
            ✉️<span>info@naturverse.com</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
