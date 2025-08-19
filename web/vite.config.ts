import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ensure assets resolve correctly when published at site root
  base: "/"
});

