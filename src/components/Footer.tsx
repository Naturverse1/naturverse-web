import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";

export default function Footer() {
  const s = SITE.socials;

  const aStyle: React.CSSProperties = {
    color: "var(--nv-blue-600)",
    textDecoration: "none",
  };

  const iconStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    display: "block",
    fill: "currentColor",
  };

  return (
    <footer className="site-footer">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          color: "var(--nv-blue-600)",
        }}
      >
        {/* LEFT: copyright (always blue) */}
        <small style={{ color: "var(--nv-blue-600)" }}>{SITE.copyright}</small>

        {/* CENTER: policy links */}
        <nav
          aria-label="Footer"
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <Link to="/about" style={aStyle}>
            About
          </Link>
          <Link to="/contact" style={aStyle}>
            Contact
          </Link>
          <Link to="/terms" style={aStyle}>
            Terms
          </Link>
          <Link to="/privacy" style={aStyle}>
            Privacy
          </Link>
        </nav>

        {/* RIGHT: social icons */}
        <nav
          aria-label="Social"
          style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
        >
          <a href={s.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube" style={aStyle}>
            {/* YouTube */}
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path d="M23.5 6.2a3.5 3.5 0 0 0-2.4-2.5C19 3.2 12 3.2 12 3.2s-7 0-9.1.5A3.5 3.5 0 0 0 .5 6.2 36 36 0 0 0 0 12a36 36 0 0 0 .5 5.8 3.5 3.5 0 0 0 2.4 2.5c2.1.5 9.1.5 9.1.5s7 0 9.1-.5a3.5 3.5 0 0 0 2.4-2.5A36 36 0 0 0 24 12a36 36 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.4 3.5-6.4 3.5Z"/>
            </svg>
          </a>
          <a href={s.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" style={aStyle}>
            {/* TikTok */}
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path d="M21 8.1a7.1 7.1 0 0 1-4.9-2V15a6 6 0 1 1-6-6c.3 0 .6 0 .9.1V12a3 3 0 1 0 3 3V1h3a7 7 0 0 0 4.1 3.8V8.1Z"/>
            </svg>
          </a>
          <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" style={aStyle}>
            {/* Facebook */}
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path d="M13 22v-8h3l.5-4H13V8a1 1 0 0 1 1-1h2V3h-3a4 4 0 0 0-4 4v3H6v4h3v8h4Z"/>
            </svg>
          </a>
          <a href={s.x} target="_blank" rel="noreferrer" aria-label="X" title="X" style={aStyle}>
            {/* X */}
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path d="M3 3h4.6l4.3 6.2L16.8 3H21l-6.8 8.8L21 21h-4.6l-4.7-6.8L7.2 21H3l7-9.1L3 3Z"/>
            </svg>
          </a>
          <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" style={aStyle}>
            {/* Instagram */}
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6.5-8.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM21 7.4v9.2A4.4 4.4 0 0 1 16.6 21H7.4A4.4 4.4 0 0 1 3 16.6V7.4A4.4 4.4 0 0 1 7.4 3h9.2A4.4 4.4 0 0 1 21 7.4Zm-2 0A2.4 2.4 0 0 0 16.6 5H7.4A2.4 2.4 0 0 0 5 7.4v9.2A2.4 2.4 0 0 0 7.4 19h9.2A2.4 2.4 0 0 0 19 16.6V7.4Z"/>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
