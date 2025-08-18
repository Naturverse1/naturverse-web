import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { applyTheme, onThemeChange } from './lib/theme';
import { bootDiagnostics } from './utils/diagnostics';
import { withSafeStorage } from './utils/safeStorage';
import './styles/app.css';
import './styles/themes.css';

applyTheme();
onThemeChange(() => applyTheme());

// 🚀 one-time boot diagnostics
bootDiagnostics();

// ✅ harden localStorage access globally
withSafeStorage();

// 🔍 capture unhandled runtime errors
window.addEventListener('error', e => console.error('[global-error]', (e as ErrorEvent).error || (e as ErrorEvent).message));
window.addEventListener('unhandledrejection', e => console.error('[unhandled-rejection]', (e as PromiseRejectionEvent).reason));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);

// ❌ Disable SW to avoid stale cache serving old JS
// Service worker registration removed.
