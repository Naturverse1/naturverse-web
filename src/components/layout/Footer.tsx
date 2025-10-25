import React from 'react';

const year = 2025;

export default function Footer() {
  return (
    <footer className="nv-footer">
      <div className="nv-footer__inner">
        {/* Left: copyright */}
        <div className="nv-footer__left">
          © {year} Turian Media Company
        </div>

        {/* Middle: site links */}
        <nav className="nv-footer__middle" aria-label="Footer">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>

        {/* Right: socials */}
        <div className="nv-footer__right" aria-label="Social links">
          <a href="https://www.youtube.com/@TuriantheDurian" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.9 3 12 3 12 3s-6.9 0-8.7.4A4 4 0 0 0 .5 6.2 41 41 0 0 0 0 12a41 41 0 0 0 .5 5.8 4 4 0 0 0 2.8 2.8C5.1 21 12 21 12 21s6.9 0 8.7-.4a4 4 0 0 0 2.8-2.8A41 41 0 0 0 24 12a41 41 0 0 0-.5-5.8zM9.8 15.5V8.5l6.4 3.5-6.4 3.5z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@turian.the.durian" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 8.9a8 8 0 0 1-4.8-1.6V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V2h3a5 5 0 0 0 4.8 4.1V8.9z"/></svg>
          </a>
          <a href="https://www.facebook.com/TurianMediaCompany" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9h4z"/></svg>
          </a>
          <a href="https://x.com/TuriantheDurain" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h4.7l5 6.7L18 3h3l-6.6 8.7L21 21h-4.7l-5.4-7.2L9 21H6l2.9-9.3L3 3z"/></svg>
          </a>
          <a href="https://instagram.com/turianthedurian" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
