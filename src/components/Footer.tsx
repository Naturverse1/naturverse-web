import { COPYRIGHT, SOCIALS } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container flex justify-between items-center gap-3">
        <p className="text-sm">{COPYRIGHT}</p>
        <nav className="flex flex-wrap gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="link-blue"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
