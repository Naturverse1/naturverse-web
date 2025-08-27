import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import './index.css';

// --- Boot diagnostics: surface any runtime errors instead of a white screen
window.addEventListener('error', (e) => {
  console.error('[boot][error]', (e as ErrorEvent).error || e.message);
});
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  console.error('[boot][unhandledrejection]', e.reason);
});
console.log('[boot] starting…');

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </React.StrictMode>,
  );
} catch (err) {
  console.error('[boot][render-failed]', err);
  const pre = document.createElement('pre');
  pre.style.padding = '16px';
  pre.style.whiteSpace = 'pre-wrap';
  pre.textContent = 'Boot failed:\n' + ((err as any)?.stack || String(err));
  document.body.innerHTML = '';
  document.body.appendChild(pre);
}
