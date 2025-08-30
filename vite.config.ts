import path from 'path'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  optimizeDeps: {
    include: ['react','react-dom','react-router-dom','@supabase/supabase-js','three','react-helmet-async']
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        }
      }
    },
    sourcemap: true,
    commonjsOptions: { include: [/node_modules/] }
  }
})
