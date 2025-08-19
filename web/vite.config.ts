import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// keep it boring + predictable
export default defineConfig({
  plugins: [react()],
  base: "/"
});
