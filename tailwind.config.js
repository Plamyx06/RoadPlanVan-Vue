/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'beige-custom': '#F8EDE0',
        'red-custom': '#8A4852'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
