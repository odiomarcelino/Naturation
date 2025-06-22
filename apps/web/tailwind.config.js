/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skyDay: '#87cefa',
        skyNight: '#0a0a2a',
      },
    },
  },
  plugins: [],
};
