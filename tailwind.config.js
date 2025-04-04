/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mars-red': '#c1440e',
        'mars-dust': '#d8a172',
        'mars-dark': '#2c1b0e',
        'mars-light': '#f9e7d2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}