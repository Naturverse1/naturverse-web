import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // keeps a stable vendor chunk so the browser can cache it longer
    splitVendorChunkPlugin(),
  ],
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Force pre-bundling during dev & build warmup
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "three",
      // add others you always ship:
      // "zustand", "clsx", "dayjs", ...
    ],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        // Small, predictable chunks for better caching
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("react") || id.includes("react-dom"))
              return "vendor-react";
            return "vendor";
          }
        },
      },
    },
    sourcemap: true, // ensure production sourcemaps
  },
});
