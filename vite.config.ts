import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { VitePWA } from 'vite-plugin-pwa'   // <- remove PWA for now
import path from 'path'

export default defineConfig({
  // Force absolute URLs for built assets, regardless of Netlify "baseRelDir"
  base: '/',

  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // PWA disabled until auth/callback is fully stable
    // ...(process.env.VITE_ENABLE_PWA === 'true' ? [VitePWA({})] : []),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    include: ['react','react-dom','react-router-dom','@supabase/supabase-js','three','react-helmet-async']
  },

  // keep your existing optimizeDeps/build options…
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets', // explicit
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
            return 'vendor'
          }
        },
      },
      // Never externalize client code accidentally
      external: [],
    },
    commonjsOptions: { include: [/node_modules/] },
  },
})
