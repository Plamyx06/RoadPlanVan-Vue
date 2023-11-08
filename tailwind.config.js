/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beigeCustom: '#F8EDE0',
        redCustom: '#8A4852'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
