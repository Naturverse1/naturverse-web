import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider as BaseAuthProvider } from './auth/AuthContext';
import { AuthProvider } from './lib/auth-context';
import './styles.css';
import './styles/shop.css';
import './styles/edu.css';
import './main.css';
import './styles/nvcard.css';
import './app.css';
import './styles/nv-sweep.css';
import './styles/ui.css';
import ToastProvider from './components/Toast';
import SkipLink from './components/SkipLink';
import OfflineBanner from './components/OfflineBanner';
import { supabase } from '@/lib/supabaseClient';
import './runtime-logger';
import { prefetchGlob, prefetchOnHover } from './lib/prefetch';
import './boot/warmup';
import { initPostHogIfEnabled } from './lib/analytics';

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  const initialSession = data.session ?? null;

  // Ensure auth context wraps the entire app so Home gets updates immediately
  const app = (
    <AuthProvider initialSession={initialSession}>
      <SkipLink />
      <ToastProvider>
        <OfflineBanner />
        <BaseAuthProvider>
          <App />
        </BaseAuthProvider>
      </ToastProvider>
    </AuthProvider>
  );

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find the root element to mount the app.');
  }

  const root = ReactDOM.createRoot(rootElement);
  const renderApp = (children: React.ReactNode) =>
    root.render(<React.StrictMode>{children}</React.StrictMode>);

  renderApp(app);
  initPostHogIfEnabled(renderApp, app);
}

bootstrap();

// Prefetch common route chunks at idle
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => {
    const routes = import.meta.glob('./routes/**/index.tsx');
    prefetchGlob(routes);
  });
} else {
  setTimeout(() => {
    const routes = import.meta.glob('./routes/**/index.tsx');
    prefetchGlob(routes);
  }, 100);
}

// Also prefetch when users hover links
prefetchOnHover();

// Force lazy loading for any <img> missing it (no deps, safe)
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll<HTMLImageElement>('img:not([loading])')
    .forEach((img) => (img.loading = 'lazy'));
});

import './styles/overrides.css';

if (import.meta.env.PROD) {
  import('./register-sw');
}
