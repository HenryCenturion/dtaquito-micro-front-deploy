/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '12': '12px',
        '16': '16px',
        '30': '30px',
      },
      screens: {
        'max-800': { 'max': '800px' },
      },
    },
  },
  plugins: [],
}
