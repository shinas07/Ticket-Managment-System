/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',
          dark: '#0369A1',
        },
        secondary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

