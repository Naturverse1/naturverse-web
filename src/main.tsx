import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider as BaseAuthProvider } from './auth/AuthContext';
import { AuthProvider } from './lib/auth-context';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';
import './styles/shop.css';
import './styles/edu.css';
import './main.css';
import './styles/nvcard.css';
import SkipToContent from './components/SkipToContent';
import { supabase } from '@/lib/supabase-client';

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  const initialSession = data.session ?? null;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      {/* Ensure auth context wraps the entire app so Home gets updates immediately */}
      <AuthProvider initialSession={initialSession}>
        <SkipToContent />
        <ErrorBoundary>
          <BaseAuthProvider>
            <App />
          </BaseAuthProvider>
        </ErrorBoundary>
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
