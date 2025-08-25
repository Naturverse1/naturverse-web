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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SkipToContent />
    <ErrorBoundary>
      <BaseAuthProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BaseAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Force lazy loading for any <img> missing it (no deps, safe)
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll<HTMLImageElement>('img:not([loading])')
    .forEach((img) => (img.loading = 'lazy'));
});
