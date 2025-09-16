import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <ul className="mt-3 space-y-2 list-none p-0">
              <li><Link className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" to="/about">About</Link></li>
              <li><Link className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" to="/contact">Contact</Link></li>
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="mailto:turianmediacompany@gmail.com">Email</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Legal</h3>
            <ul className="mt-3 space-y-2 list-none p-0">
              <li><Link className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Follow</h3>
            <ul className="mt-3 space-y-2 list-none p-0">
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="https://x.com/TuriantheDurian" target="_blank" rel="noopener noreferrer">X</a></li>
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="https://instagram.com/TuriantheDurian" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="https://facebook.com/TuriantheDurian" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="https://www.tiktok.com/@turianthedurian" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors" href="https://www.youtube.com/@TuriantheDurian" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>

          <div className="hidden lg:block" />
        </div>

        <div className="mt-10 text-center text-sm text-neutral-500">© {year} Turian Media Company</div>
      </div>
    </footer>
  );
}
