/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FFF8F0',
          100: '#FFF0E0',
          200: '#F5E6D3',
          300: '#E8D5C4',
          400: '#D4A574',
          500: '#A0522D',
          600: '#8B4513',
          700: '#6B4423',
          800: '#4A2C1A',
          900: '#2D1810',
        },
        cream: {
          50: '#FFFCF7',
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#F5E6D3',
          400: '#E8D5C4',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
