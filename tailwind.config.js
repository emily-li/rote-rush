/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['dark'],
  theme: {
    extend: {
      fontFamily: {
        'kana': ['Noto Sans JP', 'sans-serif'],
      },
      keyframes: {
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        'combo-explosion': {
          '0%': { 
            transform: 'scale(1) rotate(0deg) translateY(0)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(192 38 211 / 0)'
          },
          '25%': { 
            transform: 'scale(3) rotate(-8deg) translateY(-5px)',
            filter: 'brightness(2)',
            textShadow: '0 0 30px rgb(192 38 211 / 0.9)',
            color: 'rgb(192 38 211)'
          },
          '40%': { 
            transform: 'scale(1.8) rotate(5deg)',
            filter: 'brightness(1.8)',
            textShadow: '0 0 30px rgb(192 38 211 / 1)'
          },
          '60%': { 
            transform: 'scale(2.2) rotate(-3deg)',
            filter: 'brightness(2)',
            color: 'rgb(192 38 211)',
            textShadow: '0 0 25px rgb(192 38 211 / 0.9)'
          },
          '80%': { 
            transform: 'scale(1.5) rotate(2deg)',
            filter: 'brightness(1.5)',
            textShadow: '0 0 15px rgb(192 38 211 / 0.6)'
          },
          '100%': { 
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(192 38 211 / 0)'
          }
        }
      },
      animation: {
        'score-pop': 'score-pop 0.3s ease-out',
        'combo-explosion': 'combo-explosion 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  plugins: [],
};
