import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/', // asset URLs always resolve from the site root
  plugins: [
    react(),
    // keeps a stable vendor chunk so the browser can cache it longer
    splitVendorChunkPlugin(),
    ...(process.env.VITE_ENABLE_PWA === 'true'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
              globPatterns: ['**/*.{js,css,html,svg,png,webp,ico}'],
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              // Exclude auth routes from SPA fallback to avoid hash/callback quirks
              navigateFallbackDenylist: [/^\/auth(\/.*)?$/],
            },
            manifest: {
              name: 'Naturverse',
              short_name: 'Naturverse',
              theme_color: '#2563eb',
              background_color: '#ffffff',
              start_url: '.',
              display: 'standalone',
              icons: [
                { src: 'favicon-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: 'favicon-256x256.png', sizes: '256x256', type: 'image/png' },
                {
                  src: 'favicon-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any maskable',
                },
              ],
            },
            // Runtime caching for stuff that isn’t in the precache
            runtimeCaching: [
              {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'CacheFirst',
                options: {
                  cacheName: 'nv-images',
                  expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 60 * 60 * 24 * 30,
                  },
                },
              },
              {
                urlPattern: /https:\/\/[^/]*supabase\.co\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'nv-supabase',
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24,
                  },
                },
              },
            ],
          }),
        ]
      : []),
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
    ],
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
    sourcemap: true, // ensure production sourcemaps
    commonjsOptions: {
      // allow CJS in node_modules to be bundled
      include: [/node_modules/],
    },
  },
});
