import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simple, stable Vite config.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
  optimizeDeps: {
    // Make sure these prebundle cleanly on Netlify
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
  }
});

