import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/app.css";
import "./styles/themes.css";
import { applyTheme, onThemeChange } from "./lib/theme";

applyTheme();
onThemeChange(() => applyTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
