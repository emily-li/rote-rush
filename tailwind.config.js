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
      animation: {
        'shrink-width': 'shrinkWidth 1s forwards',
      },
      keyframes: {
        shrinkWidth: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
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
        },
        { values: theme('textShadow') },
      );
    }),
  ],
};
