import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import './index.css';
import { loadFlags } from './lib/flags';
import { sendEvent } from './lib/telemetry';

// safety: disable PWA by default in prod
const DISABLE_PWA = import.meta.env.VITE_DISABLE_PWA !== '0';

if (DISABLE_PWA && typeof window !== 'undefined') {
  import('./lib/killSW').then(m => m.killServiceWorkers());
}

// ---- Boot diagnostics: never silently white-screen
window.addEventListener('error', (e) =>
  console.error('[boot:error]', (e as ErrorEvent).error || e.message)
);
window.addEventListener('unhandledrejection', (e) =>
  console.error('[boot:unhandled]', (e as PromiseRejectionEvent).reason)
);
console.log('[boot] starting…');

function mount() {
  try {
    let el = document.getElementById('root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'root';
      document.body.appendChild(el);
      console.warn('[boot] #root not found; created one');
    }
    const root = createRoot(el);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </React.StrictMode>,
    );
    console.log('[boot] rendered');
    (async () => {
      const flags = await loadFlags();
      if (flags.telemetry) {
        sendEvent({ name: 'pageview' });
      }
    })();
  } catch (err) {
    console.error('[boot] render failed:', err);
    const pre = document.createElement('pre');
    pre.style.padding = '16px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = 'Boot failed:\n' + ((err as any)?.stack || String(err));
    document.body.innerHTML = '';
    document.body.appendChild(pre);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

// Make sure NO service worker is registered here.
// (Leave PWA off until we intentionally re-enable.)
