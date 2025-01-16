/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend: {
      colors:
      {
        main: '#D81E0B',
        main_dark: '#981003',
        secondary: '#F5671B',
        gray_main: '#F9F9F9',
        gray_dark_500: '#5F7E8A',
        gray_dark_600: '#48616B',
      },
    },
    container: {
      center: true,
      padding: '1rem',
    }
  },
  plugins: [require('@tailwindcss/forms')],
}

