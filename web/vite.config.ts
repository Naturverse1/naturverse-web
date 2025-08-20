import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Clean config: no runtime aliasing. Vite + React 18 resolve jsx-runtime automatically.
export default defineConfig({
  plugins: [react()],
})

