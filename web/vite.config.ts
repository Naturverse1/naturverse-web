import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: no build.rollupOptions.external here.
// Vite will bundle react/jsx-runtime from React automatically.

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    sourcemap: false
  }
});
