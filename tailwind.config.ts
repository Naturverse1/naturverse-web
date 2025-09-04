import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './client/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--brand-primary-50)',
          100: 'var(--brand-primary-100)',
          200: 'var(--brand-primary-200)',
          300: 'var(--brand-primary-300)',
          400: 'var(--brand-primary-400)',
          500: 'var(--brand-primary-500)',
          600: 'var(--brand-primary-600)',
          700: 'var(--brand-primary-700)',
          800: 'var(--brand-primary-800)',
          900: 'var(--brand-primary-900)',
        },
      },
      textColor: {
        DEFAULT: 'var(--text-base)',
        strong:  'var(--text-strong)',
        muted:   'var(--text-muted)',
      },
      ringColor: {
        brand: 'var(--ring-brand)',
      },
    },
  },
  safelist: [
    'text-primary-600','hover:text-primary-700',
    'bg-primary-600','hover:bg-primary-700',
    'border-primary-600'
  ],
  plugins: [],
};

export default config;
