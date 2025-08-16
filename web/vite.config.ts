import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  build: {
    // helps some “cannot resolve entry chunk” issues when code-splitting
    sourcemap: false,
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
});
