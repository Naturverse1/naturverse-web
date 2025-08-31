import React from "react";
import Icon from "./Icon";
import { SOCIALS } from "../config/socials";

export default function Footer() {
  return (
    <footer className="nv-footer">
      <p>© {new Date().getFullYear()} Naturverse</p>
      <div className="nv-footer-links">
        <a href="mailto:info@thenaturverse.com" aria-label="Email us">
          <Icon name="contact" size={18} />
        </a>
        <a
          href={SOCIALS.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
        >
          @TuriantheDurian
        </a>
        <a
          href={SOCIALS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          @TuriantheDurian
        </a>
        <a
          href={SOCIALS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          @TuriantheDurian
        </a>
        <a
          href={SOCIALS.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          @TuriantheDurian
        </a>
        <a
          href={SOCIALS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          @TuriantheDurian
        </a>
      </div>
    </footer>
  );
}
