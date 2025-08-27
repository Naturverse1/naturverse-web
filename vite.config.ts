import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';  // temporarily disabled
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Disable dev-only transform that uses eval()
      babel: {
        plugins: [],
      },
      fastRefresh: false,
    }),
    // Re-enable after we add valid icons & test:
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'Naturverse',
    //     short_name: 'Naturverse',
    //     start_url: '/',
    //     display: 'standalone',
    //     background_color: '#ffffff',
    //     theme_color: '#0ea5e9',
    //     icons: [] // keep empty until real PNGs exist in /public
    //   },
    //   workbox: { clientsClaim: true, skipWaiting: true, cleanupOutdatedCaches: true }
    // })
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Force pre-bundling during dev & build warmup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'three',
      // add others you always ship:
      // "zustand", "clsx", "dayjs", ...
      'react-helmet-async',
      'copy-to-clipboard',
      'react-share',
    ],
  },
  ssr: {
    noExternal: ['react-share'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        // Small, predictable chunks for better caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            return 'vendor';
          }
        },
      },
    },
    sourcemap: false, // prevents inline eval source maps
    commonjsOptions: {
      // allow CJS in node_modules to be bundled
      include: [/node_modules/],
    },
  },
});
