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
import ToastProvider from './components/Toast';
import SkipLink from './components/SkipLink';
import OfflineBanner from './components/OfflineBanner';
import { getBrowserClient } from '@/lib/supabase/browser';
import './runtime-logger';
import './boot/warmup';

const supabase = getBrowserClient();

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  const initialSession = data.session ?? null;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      {/* Ensure auth context wraps the entire app so Home gets updates immediately */}
      <AuthProvider initialSession={initialSession}>
        <SkipLink />
        <ToastProvider>
          <OfflineBanner />
          <BaseAuthProvider>
            <App />
          </BaseAuthProvider>
        </ToastProvider>
      </AuthProvider>
    </React.StrictMode>,
  );
}

bootstrap();

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
