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

applyTheme();
onThemeChange(() => applyTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <UpdateToast />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((e) => {
      console.warn('SW registration failed', e);
    });
  });
}
