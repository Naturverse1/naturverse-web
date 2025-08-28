import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import './index.css';
import { loadFlags } from './lib/flags';
import { sendEvent } from './lib/telemetry';
import { ensureNoServiceWorker } from './lib/disableSW';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

ensureNoServiceWorker();

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
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </GlobalErrorBoundary>
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
    pre.textContent = String((err as any)?.stack || err);
    document.body.appendChild(pre);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

