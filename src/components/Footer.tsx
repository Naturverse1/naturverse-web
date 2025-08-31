import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">© {YEAR} Turian Media Company</p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <li><Link className="text-slate-500 hover:text-primary-600" to="/terms">Terms</Link></li>
            <li><Link className="text-slate-500 hover:text-primary-600" to="/privacy">Privacy</Link></li>
            <li><Link className="text-slate-500 hover:text-primary-600" to="/contact">Contact</Link></li>
            <li><a className="text-slate-500 hover:text-primary-600" href="https://x.com/TuriantheDurian" target="_blank" rel="noreferrer">X</a></li>
            <li><a className="text-slate-500 hover:text-primary-600" href="https://instagram.com/turianthedurian" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a className="text-slate-500 hover:text-primary-600" href="https://tiktok.com/@TuriantheDurian" target="_blank" rel="noreferrer">TikTok</a></li>
            <li><a className="text-slate-500 hover:text-primary-600" href="https://youtube.com/@TuriantheDurian" target="_blank" rel="noreferrer">YouTube</a></li>
            <li><a className="text-slate-500 hover:text-primary-600" href="https://facebook.com/TurianMediaCompany" target="_blank" rel="noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
