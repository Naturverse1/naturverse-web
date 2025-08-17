import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import { AuthProvider } from './context/AuthContext';
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
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
