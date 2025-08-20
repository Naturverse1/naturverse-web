import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "/",               // important for Netlify at root domain
  build: { outDir: "dist" }, // publish = dist
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
