/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,md,mdx}"
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem"
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#16a34a", // emerald-600
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        }
      },
      fontFamily: {
        display: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ]
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
