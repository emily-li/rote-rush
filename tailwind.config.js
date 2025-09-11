/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['dark'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        kana: ['Noto Sans JP', 'sans-serif'],
      },
      textShadow: {
        DEFAULT: '0 0 3px rgba(192, 38, 211)',
        lg: '0 0 10px rgba(192, 38, 211)',
      },
      keyframes: {
        jiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
      },
      animation: {
        jiggle: 'jiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
          'box-glow': () => ({
            boxShadow: '0 0 8px 8px rgba(192, 38, 211, 0.4)',
          }),
        },
        { values: theme('textShadow') },
      );
    }),
  ],
};
