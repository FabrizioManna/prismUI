/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,js,html}",
    "./docs/**/*.{md,vue,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'glass-light': 'rgba(255, 255, 255, 0.4)',
        'glass-dark': 'rgba(15, 23, 42, 0.6)',
      },
      backdropBlur: {
        'md': '12px',
        'lg': '16px',
      },
      borderColor: {
        'glass-light': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
