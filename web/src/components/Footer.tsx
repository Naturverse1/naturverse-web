import React from 'react';

export default function Footer() {
  const version = (import.meta.env.VITE_APP_VERSION as string) ?? '';
  return (
    <footer className="text-xs text-center text-white/60 py-6 mt-12">
      <nav className="space-x-4">
        <a href="/privacy" className="hover:text-white">Privacy</a>
        <a href="/terms" className="hover:text-white">Terms</a>
        <a href="/contact" className="hover:text-white">Contact</a>
      </nav>
      {version && <p className="mt-2">Build {version}</p>}
    </footer>
  );
}

