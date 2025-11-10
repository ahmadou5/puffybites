/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // violet-500 (light purple)
        'primary-dark': '#7c3aed', // violet-600
        'primary-light': '#a78bfa', // violet-400
        secondary: '#2563eb', // blue-600
        'secondary-dark': '#1d4ed8', // blue-700
        'secondary-light': '#3b82f6', // blue-500
      },
      fontFamily: {
        'sans': ['Kanit', 'Inter', 'system-ui', 'sans-serif'],
        'kanit': ['Kanit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}