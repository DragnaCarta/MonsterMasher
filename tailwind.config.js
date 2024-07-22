/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F5E6D3',
        'secondary-bg': '#E6D2B8',
        'primary-text': '#4A3728',
        'accent': '#8B1E3F',
        'accent-dark': '#6A1730',
        'highlight': '#C4A484',
        'highlight-dark': '#A38B6D',
      },
    },
  },
  plugins: [],
}