import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  safelist: [
    'text-brand-600','hover:text-brand-700',
    'bg-brand-600','hover:bg-brand-700',
    'border-brand-600'
  ],
  plugins: [],
};

export default config;
