import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="muted">© {new Date().getFullYear()} Naturverse</p>

        <a
          className="tmc-badge"
          href="https://turian.media" /* or your canonical company URL */
          target="_blank"
          rel="noopener noreferrer"
          aria-label="A Turian Media Company"
        >
          <img
            src="/attached_assets/turian_media_logo_transparent.png"
            alt="Turian Media logo"
            className="tmc-logo"
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
          />
          <span>A Turian Media Company</span>
        </a>
      </div>
    </footer>
  );
}
