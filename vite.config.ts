import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// IMPORTANT: absolute root so built assets are /assets/... even on /auth/callback
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    sourcemap: false,
    outDir: 'dist',
  },
})
