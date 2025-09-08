/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#35414f',
          light: '#1f2a36',
          DEFAULT: '#101820',
          pure: '#101820',
          dark: '#0c141a',
          darkest: '#000000',
        },
        secondary: {
          lightest: '#ff9c6a',
          light: '#ff7846',
          DEFAULT: '#fc4c02',
          pure: '#fc4c02',
          dark: '#d63d01',
          darkest: '#a33400',
        }
      }
    },
  },
  plugins: [],
}
