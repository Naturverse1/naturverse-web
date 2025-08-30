import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  // Force absolute asset URLs so nested routes like /auth/callback
  // don’t try to load /auth/assets/* and break MIME type checks.
  base: '/',
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // PWA disabled by default. If you ever want it back,
    // re-enable the plugin behind the env flag.
  ],
  // Keep source maps in prod while we stabilize
  sourcemap: true,
  // Avoid accidental externalization that caused “failed to resolve import”
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('@supabase') || id.includes('react'))
              return 'vendor'
          }
        }
      }
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'three',
      'react-helmet-async',
    ],
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
