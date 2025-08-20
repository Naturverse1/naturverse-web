import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

const el = document.getElementById("root");
if (!el) {
  throw new Error("Root element #root not found in index.html");
}
createRoot(el).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

