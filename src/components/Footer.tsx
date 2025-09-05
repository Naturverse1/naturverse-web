import { SITE } from '@/lib/site';

export default function Footer() {
  const s = SITE.socials;

  return (
    <footer className="site-footer">
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Copyright in brand blue */}
        <small style={{ color: 'var(--nv-blue-600)' }}>
          © 2025 Turian Media Company
        </small>

        {/* Socials with guaranteed spacing */}
        <nav aria-label="Social links" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.youtube}   target="_blank" rel="noopener noreferrer">YouTube</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.tiktok}    target="_blank" rel="noopener noreferrer">TikTok</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.facebook}  target="_blank" rel="noopener noreferrer">Facebook</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.x}         target="_blank" rel="noopener noreferrer">X</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        </nav>
      </div>
    </footer>
  );
}

