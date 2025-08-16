import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
root: path.resolve(__dirname),
plugins: [react()],
resolve: {
  alias: {
"@": path.resolve(__dirname, "src"),
},
},
optimizeDeps: {
  include: ["three", "@react-three/fiber"],
},
server: { port: 5173, strictPort: true },
preview: { port: 5173, strictPort: true },
build: { outDir: "dist", sourcemap: false },
});
