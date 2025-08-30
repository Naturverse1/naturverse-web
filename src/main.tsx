import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { swCleanupOnce } from '@/lib/swCleanup';
import { AuthProvider as BaseAuthProvider } from './auth/AuthContext';
import { AuthProvider } from './lib/auth-context';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './styles.css';
import './styles/shop.css';
import './styles/edu.css';
import './main.css';
import './styles/nvcard.css';
import './app.css';
import './styles/nv-sweep.css';
import './styles/mega-features.css';
import './index.css';
import './styles/theme.css';
import './styles/cart.css';
import { applyTheme, getTheme } from './lib/theme';
import ToastProvider from './components/Toast';
import { getSupabase } from '@/lib/supabase-client';
import WorldExtras from './components/WorldExtras';
import CommandPalette from './components/CommandPalette';
import { router } from './router';
import './runtime-logger';
import { prefetchGlob, prefetchOnHover } from './lib/prefetch';
import './boot/warmup';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { installGlobalLogCapture } from '@/lib/log';

swCleanupOnce();
applyTheme(getTheme());
installGlobalLogCapture();


function RootWithPalette({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    return router.subscribe((s) => setPath(s.location.pathname));
  }, []);

  useEffect(() => {
    if (path.startsWith('/auth/')) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [path]);

  const onAuthRoute = path.startsWith('/auth/');

  return (
    <>
      {children}
      {!onAuthRoute && <CommandPalette open={open} onClose={() => setOpen(false)} />}
    </>
  );
}

async function bootstrap() {
  const supabase = getSupabase();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const initialSession = data.session ?? null;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        {supabase ? (
          <AuthProvider initialSession={initialSession}>
            <ToastProvider>
              <BaseAuthProvider>
                <RootWithPalette>
                  <AppErrorBoundary>
                    <App />
                  </AppErrorBoundary>
                  <WorldExtras />
                </RootWithPalette>
              </BaseAuthProvider>
            </ToastProvider>
          </AuthProvider>
        ) : (
          <ToastProvider>
            <RootWithPalette>
              <AppErrorBoundary>
                <App />
              </AppErrorBoundary>
              <WorldExtras />
            </RootWithPalette>
          </ToastProvider>
        )}
      </Elements>
    </React.StrictMode>,
  );
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
