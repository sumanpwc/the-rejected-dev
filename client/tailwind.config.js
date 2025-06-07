/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // ✅ Respect system theme preference
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
