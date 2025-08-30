import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',                   // absolute assets no matter the route
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
