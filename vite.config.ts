import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",               // important for Netlify at root domain
  build: { outDir: "dist" }, // publish = dist
});
