import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="border-t bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 text-sm text-neutral-600">
            <p className="text-neutral-900 font-semibold">Naturverse</p>
            <p>Where learning becomes adventure.</p>
            <p>© {year} Turian Media Company</p>
          </div>
          <div className="space-y-2 text-sm text-neutral-600">
            <p className="text-neutral-900 font-semibold">Company</p>
            <Link to="/about" className="hover:text-neutral-900 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-neutral-900 transition-colors">
              Contact
            </Link>
            <a
              href="mailto:turianmediacompany@gmail.com"
              className="hover:text-neutral-900 transition-colors"
            >
              Email
            </a>
          </div>
          <div className="space-y-2 text-sm text-neutral-600">
            <p className="text-neutral-900 font-semibold">Legal</p>
            <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-neutral-900 transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="space-y-2 text-sm text-neutral-600">
            <p className="text-neutral-900 font-semibold">Follow</p>
            <a
              href="https://x.com/TuriantheDurian"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
            >
              X
            </a>
            <a
              href="https://instagram.com/turianthedurian"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/TurianMediaCompany"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
