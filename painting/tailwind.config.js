/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dopaper: {
          50: '#fbf8f1',
          100: '#f5eedb',
          200: '#ebd9b8',
          300: '#dec291',
          400: '#cfa56b',
          500: '#b8894a',
        },
        ink: {
          900: '#141211',
          800: '#1f1c1a',
          700: '#2d2926',
          600: '#423d38',
        },
        cinnabar: {
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
        },
        ancientgold: {
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', '"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
