import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__left">© 2025 Naturverse</div>

        <div className="site-footer__right footer-brand" role="contentinfo" aria-label="Publisher">
          <img
            src="/attached_assets/turian_media_logo_transparent.png"
            alt="Turian Media"
            className="footer-brand__img"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="footer-brand__text">A Turian Media Company</span>
        </div>
      </div>
    </footer>
  );
}
