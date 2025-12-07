/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'rdo-red': '#8B0000',
        'rdo-gold': '#D4AF37',
        'rdo-paper': '#F4E8D0',
        'rdo-leather': '#3E2723',
        'rdo-dark': '#1A0F0A',
        'rdo-tan': '#C9A961',
        'rdo-rust': '#B87333',
        'rdo-shadow': 'rgba(0, 0, 0, 0.7)',
      },
      boxShadow: {
        'rdo': '0 4px 20px rgba(0, 0, 0, 0.7)',
        'rdo-gold': '0 0 30px rgba(212, 175, 55, 0.15)',
      },
      fontFamily: {
        'western': ['Cinzel', 'Rye', 'Georgia', 'serif'],
        'body': ['Roboto Condensed', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
