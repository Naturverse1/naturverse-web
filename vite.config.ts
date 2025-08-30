import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/',                       // ensures absolute asset URLs
  plugins: [react(), splitVendorChunkPlugin()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  optimizeDeps: {
    include: [
      'react','react-dom','react-router-dom','@supabase/supabase-js','three','react-helmet-async'
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // DO NOT externalize app deps: caused unresolved imports in Netlify
    rollupOptions: {
      // no external
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
    commonjsOptions: { include: [/node_modules/] },
  },
})
