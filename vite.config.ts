import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // keeps a stable vendor chunk so the browser can cache it longer
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'favicon.svg', 'icons/*'],
      manifest: {
        name: 'Naturverse',
        short_name: 'Naturverse',
        theme_color: '#2b64ff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        icons: [
          { src: '/favicon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
          { src: '/favicon-256x256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        navigateFallback: '/offline.html',
        globPatterns: ['**/*.{js,css,html,ico,svg,png,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
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
    sourcemap: true, // ensure production sourcemaps
    commonjsOptions: {
      // allow CJS in node_modules to be bundled
      include: [/node_modules/],
    },
  },
});
