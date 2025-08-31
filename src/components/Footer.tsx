import React from "react";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="nv-footer">
      <p>© {new Date().getFullYear()} Naturverse</p>
      <div className="nv-footer-links">
        <a href="mailto:info@thenaturverse.com" aria-label="Email us">
          <Icon name="contact" size={18} />
        </a>
        <a href="https://twitter.com/naturverse" target="_blank" rel="noopener" aria-label="Twitter">
          <Icon name="arrow" size={18} />
        </a>
        <a href="https://instagram.com/naturverse" target="_blank" rel="noopener" aria-label="Instagram">
          <Icon name="world" size={18} />
        </a>
      </div>
    </footer>
  );
}
