import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    // keeps a stable vendor chunk so the browser can cache it longer
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Naturverse',
        short_name: 'Naturverse',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        icons: [],
      },
      workbox: {
        navigateFallback: '/offline.html',
        // Precache only the essentials so build doesn't fail on large PNGs
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        // Explicitly ignore heavy image folders from precache
        globIgnores: [
          '**/kingdoms/**/*.png',
          '**/Languages/**/*.png',
          '**/Mapsmain/**/*.png',
          '**/Marketplace/**/*.png',
          '**/*.{jpg,jpeg,png,webp,avif,gif}',
        ],
        // Runtime caching so images are cached on-demand (fast repeats, smaller SW)
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'naturverse-images',
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
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
