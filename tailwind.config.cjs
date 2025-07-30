/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8925F2',
          600: '#7c3aed',
          700: '#6F1CC7',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'primaryHover': '#6F1CC7',
        'primaryLight': '#D9B6FF',
        'background': '#F9FAFB',
        'text': '#1E293B',
      },
    },
  },
  plugins: [],
} 