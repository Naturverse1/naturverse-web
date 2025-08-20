import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./styles/index.css";

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

createRoot(el).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
