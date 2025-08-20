import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ensure correct asset paths on Netlify
  plugins: [react()],
  build: { sourcemap: true }
})
