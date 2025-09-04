import { SITE } from '@/lib/site';

export default function Footer() {
  const s = SITE.socials;

  return (
    <footer className="footer">
      <div className="copy">{SITE.copyright}</div>
      <nav className="socials">
        <a href={s.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href={s.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
        <a href={s.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={s.x} target="_blank" rel="noopener noreferrer">X</a>
        <a href={s.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
    </footer>
  );
}
