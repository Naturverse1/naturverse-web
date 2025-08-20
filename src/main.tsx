// Hard-kill any previously registered service workers (from older builds)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => {
      for (const r of regs) r.unregister();
    })
    .catch(() => {});
  // Also stop the active controller so reload pulls fresh assets
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
  }
}

import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

const el = document.getElementById("root");
if (!el) {
  // fail loudly so we don’t silently white-screen
  throw new Error("Root element #root not found");
}

createRoot(el).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

