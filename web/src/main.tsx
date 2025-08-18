import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import UpdateToast from './components/UpdateToast';
import "./styles/app.css";
import "./styles/themes.css";
import { applyTheme, onThemeChange } from "./lib/theme";
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';

applyTheme();
onThemeChange(() => applyTheme());

try {
  console.info('[Naturverse] boot:start', { ts: new Date().toISOString(), env: import.meta.env.MODE });
  localStorage.setItem('naturverse_boot', new Date().toISOString());
} catch {}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <UpdateToast />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
