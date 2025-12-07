/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Red Dead Redemption 2 Color Palette
        'rdo-red': '#8B0000',        // Deep crimson (primary accent)
        'rdo-gold': '#D4AF37',       // Antique gold (highlights/borders)
        'rdo-paper': '#F4E8D0',      // Aged paper (text on dark backgrounds)
        'rdo-leather': '#3E2723',    // Dark leather brown (panels/cards)
        'rdo-dark': '#1A0F0A',       // Deep brown-black (main background)
        'rdo-tan': '#C4A57B',        // Light tan (secondary text)
        'rdo-rust': '#A0522D',       // Rust orange (warnings/alerts)
        'rdo-green': '#2E7D32',      // Muted green (success states)
      },
      fontFamily: {
        // Western-style fonts (loaded via Google Fonts in index.html)
        'western': ['"Rye"', 'serif'],           // For headers/titles
        'body': ['"Cinzel"', 'serif'],          // For body text
        'display': ['"Pirata One"', 'cursive'], // For decorative elements
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"...)",
        'leather-texture': "url('/assets/leather-texture.png')", // Optional: add texture file
      },
      boxShadow: {
        'rdo': '0 4px 6px -1px rgba(139, 0, 0, 0.3), 0 2px 4px -1px rgba(139, 0, 0, 0.2)',
        'rdo-gold': '0 0 10px rgba(212, 175, 55, 0.5)',
      },
    },
  },
  plugins: [],
};
