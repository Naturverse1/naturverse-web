import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-neutral-50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Company</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link to="/about" className="hover:text-neutral-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-neutral-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:turianmediacompany@gmail.com"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Legal</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-neutral-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Follow</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <a
                  href="https://x.com/TuriantheDurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  X
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/TuriantheDurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/TuriantheDurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@turianthedurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@TuriantheDurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-neutral-500">
          © 2025 Turian Media Company
        </p>
      </div>
    </footer>
  );
}
