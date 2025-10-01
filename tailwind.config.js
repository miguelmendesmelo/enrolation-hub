/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores RGB Retro
        'retro-red': '#FF0040',
        'retro-green': '#00FF41',
        'retro-blue': '#0080FF',
        'retro-cyan': '#00FFFF',
        'retro-magenta': '#FF00FF',
        'retro-yellow': '#FFFF00',

        // Beges
        'beige': {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5EBD9',
          300: '#EFE0C4',
          400: '#E5CB9F',
          500: '#D4AF7A',
          600: '#C39962',
          700: '#9A7A4D',
          800: '#6B563A',
          900: '#4A3B29',
        },

        // Cinzas escuros para contraste
        'retro-dark': '#1A1A1A',
        'retro-darker': '#0D0D0D',
      },
    },
  },
  plugins: [],
}
