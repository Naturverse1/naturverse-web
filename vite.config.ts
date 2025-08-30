import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react(), splitVendorChunkPlugin()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
