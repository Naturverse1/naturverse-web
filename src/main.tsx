import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { loadFlags } from './lib/flags';
import { sendEvent } from './lib/telemetry';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

// TEMP: ensure no service worker remains. This prevents the “Offline” page.
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.()
    .then((rs) => rs.forEach((r) => r.unregister()))
    .catch(() => {});
}

declare global {
  interface Window {
    __NATURVERSE_READY__?: boolean;
  }
}

// ---- Boot diagnostics: never silently white-screen
window.addEventListener('error', (e) => {
  console.error('[naturverse] window error', (e as ErrorEvent).error ?? e.message ?? e);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[naturverse] unhandledrejection', (e as PromiseRejectionEvent).reason ?? e);
});
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
        <GlobalErrorBoundary>
          <App />
        </GlobalErrorBoundary>
      </React.StrictMode>,
    );
    window.__NATURVERSE_READY__ = true;
    window.dispatchEvent(new Event('naturverse:ready'));
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
    pre.textContent = String((err as any)?.stack || err);
    document.body.appendChild(pre);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

