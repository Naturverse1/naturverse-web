import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',               // ensure absolute asset URLs (fixes MIME issues)
  plugins: [react()],
  server: { port: 5173 },  // dev only; Netlify ignores this in build
  preview: { port: 5174 }, // dev only
  resolve: { alias: { '@': '/src' } },
})
