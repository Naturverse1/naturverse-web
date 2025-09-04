import { SITE } from '@/lib/site';

export default function Footer() {
  const s = SITE.socials;

  return (
    <footer className="site-footer">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <small style={{ color: 'var(--nv-blue-600)' }}>{SITE.copyright}</small>
        <nav style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.youtube} target="_blank" rel="noreferrer">YouTube</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.x} target="_blank" rel="noreferrer">X</a>
          <a style={{ color: 'var(--nv-blue-600)' }} href={s.instagram} target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </div>
    </footer>
  );
}
