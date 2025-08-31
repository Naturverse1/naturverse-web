import * as React from 'react';

const socials = [
  { name: 'X',        href: 'https://x.com/TuriantheDurian' },
  { name: 'Instagram',href: 'https://instagram.com/turianthedurian' },
  { name: 'TikTok',   href: 'https://tiktok.com/@turian.the.durian' },
  { name: 'YouTube',  href: 'https://youtube.com/@TuriantheDurian' },
  { name: 'Facebook', href: 'https://facebook.com/TurianMediaCompany' },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white/70">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: copyright */}
          <p className="text-slate-500 text-sm">
            © 2025 Turian Media Company
          </p>

          {/* Right: links */}
          <nav aria-label="footer" className="text-sm">
            <ul className="list-none m-0 p-0 flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
              <li><a className="text-slate-500 hover:text-slate-800" href="/terms">Terms</a></li>
              <li><a className="text-slate-500 hover:text-slate-800" href="/privacy">Privacy</a></li>
              <li><a className="text-slate-500 hover:text-slate-800" href="/contact">Contact</a></li>
              {socials.map(s => (
                <li key={s.name}>
                  <a className="text-slate-500 hover:text-slate-800" href={s.href} target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
