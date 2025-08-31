import * as React from 'react';
import { Link } from 'react-router-dom';
import { SOCIALS } from '@/lib/socials';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        marginTop: '4rem',
        padding: '1.25rem 0',
        borderTop: '1px solid var(--border, #e5e7eb)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ opacity: 0.9 }}>© {year} Turian Media Company</div>

        <nav aria-label="Legal" style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <Link to="/terms" className="link">Terms</Link>
          <span aria-hidden>·</span>
          <Link to="/privacy" className="link">Privacy</Link>
          <span aria-hidden>·</span>
          <Link to="/contact" className="link">Contact</Link>
        </nav>

        <nav aria-label="Social media" style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
              aria-label={s.name}
            >
              {s.name}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
