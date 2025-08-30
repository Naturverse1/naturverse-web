import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',                // critical so /auth/* doesn't rewrite asset URLs
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  build: { sourcemap: false },
});
