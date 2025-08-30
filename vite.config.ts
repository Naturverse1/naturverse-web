import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/',                               // 🔒 absolute asset URLs (fixes /auth/assets/…)
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: { },
    commonjsOptions: { include: [/node_modules/] },
  },
})
