import React from "react";
import Icon from "./Icon";
import { SOCIALS } from '@/lib/socials';

export default function Footer() {
  return (
    <footer className="nv-footer">
      <p>© {new Date().getFullYear()} Naturverse</p>
      <div className="nv-footer-links">
        <a href="mailto:info@thenaturverse.com" aria-label="Email us">
          <Icon name="contact" size={18} />
        </a>
        <ul className="socials" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.aria ?? s.name}
                className="link"
              >
                {s.icon ?? <span>{s.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
