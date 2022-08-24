/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{vue,js,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      ...colors,
      sakura: '#fa84d2',
      milk: '#ede6db',
      cloudy: '#9ab3bf',
      leaf: '#417d7a',
      'leaf-dark': '#1a3c40',
      cherry: '#804366',
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      righteous: ['Righteous', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
