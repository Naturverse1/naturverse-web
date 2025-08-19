import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Netlify uses Node 18; ensure Vite treats heavy libs as external if needed
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react-router-dom',
        '@supabase/supabase-js'
      ]
    }
  }
})
