import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--nv-primary-50)',
          100: 'var(--nv-primary-100)',
          200: 'var(--nv-primary-200)',
          300: 'var(--nv-primary-300)',
          400: 'var(--nv-primary-400)',
          500: 'var(--nv-primary-500)',
          600: 'var(--nv-primary-600)',
          700: 'var(--nv-primary-700)',
          800: 'var(--nv-primary-800)',
          900: 'var(--nv-primary-900)',
          DEFAULT: 'var(--nv-primary)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
