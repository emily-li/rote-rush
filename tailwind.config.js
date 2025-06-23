/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['dark'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Comfortaa', 'cursive'], // Fun but elegant default font
        kana: ['Noto Sans JP', 'sans-serif'], // Clear font for Japanese characters
      },
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
        25: 'repeat(25, minmax(0, 1fr))',
        30: 'repeat(30, minmax(0, 1fr))',
      },
      keyframes: {
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'streak-reset': {
          '0%': {
            transform: 'scale(1) rotate(0deg) translateY(0)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(239 68 68 / 0)',
          },
          '25%': {
            transform: 'scale(3) rotate(-8deg) translateY(-5px)',
            filter: 'brightness(2)',
            textShadow: '0 0 30px rgb(239 68 68 / 0.9)',
            color: 'rgb(239 68 68)', // red-500
          },
          '40%': {
            transform: 'scale(1.8) rotate(5deg)',
            filter: 'brightness(1.8)',
            textShadow: '0 0 30px rgb(239 68 68 / 1)',
          },
          '60%': {
            transform: 'scale(2.2) rotate(-3deg)',
            filter: 'brightness(2)',
            color: 'rgb(239 68 68)',
            textShadow: '0 0 25px rgb(239 68 68 / 0.9)',
          },
          '80%': {
            transform: 'scale(1.5) rotate(2deg)',
            filter: 'brightness(1.5)',
            textShadow: '0 0 15px rgb(239 68 68 / 0.6)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(239 68 68 / 0)',
          },
        },
        'red-explosion': {
          '0%': {
            transform: 'scale(1) rotate(0deg) translateY(0)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(239 68 68 / 0)',
          },
          '25%': {
            transform: 'scale(3) rotate(-8deg) translateY(-5px)',
            filter: 'brightness(2)',
            textShadow: '0 0 30px rgb(239 68 68 / 0.9)',
            color: 'rgb(239 68 68)', // red-500
          },
          '40%': {
            transform: 'scale(1.8) rotate(5deg)',
            filter: 'brightness(1.8)',
            textShadow: '0 0 30px rgb(239 68 68 / 1)',
          },
          '60%': {
            transform: 'scale(2.2) rotate(-3deg)',
            filter: 'brightness(2)',
            color: 'rgb(239 68 68)',
            textShadow: '0 0 25px rgb(239 68 68 / 0.9)',
          },
          '80%': {
            transform: 'scale(1.5) rotate(2deg)',
            filter: 'brightness(1.5)',
            textShadow: '0 0 15px rgb(239 68 68 / 0.6)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)',
            textShadow: '0 0 0px rgb(239 68 68 / 0)',
          },
        },
        'combo-explosion': {
          '0%': {
            transform: 'scale(1) rotate(0deg) translateY(0)',
            filter: 'brightness(1)',
            textShadow: '0 0 2px rgba(192, 38, 211, 0.2)',
          },
          '25%': {
            transform: 'scale(3) rotate(-8deg) translateY(-5px)',
            filter: 'brightness(2)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
            color: 'rgb(192 38 211)',
          },
          '40%': {
            transform: 'scale(1.8) rotate(5deg)',
            filter: 'brightness(1.8)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '60%': {
            transform: 'scale(2.2) rotate(-3deg)',
            filter: 'brightness(2)',
            color: 'rgb(192 38 211)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '80%': {
            transform: 'scale(1.5) rotate(2deg)',
            filter: 'brightness(1.5)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1)',
            textShadow: '0 0 2px rgba(192, 38, 211, 0.2)',
          },
        },
        pulse: {
          '0%': { transform: 'scale(1)', opacity: 0.9 },
          '100%': { transform: 'scale(1.05)', opacity: 1 },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'mega-explosion': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1) blur(0px)',
            textShadow: '0 0 2px rgba(192, 38, 211, 0.2)',
          },
          '25%': {
            transform: 'scale(5) rotate(-12deg)',
            filter: 'brightness(3) blur(2px)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
            color: 'rgb(192 38 211)',
          },
          '40%': {
            transform: 'scale(3) rotate(8deg)',
            filter: 'brightness(2.5) blur(1px)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '60%': {
            transform: 'scale(4) rotate(-5deg)',
            filter: 'brightness(3) blur(2px)',
            color: 'rgb(192 38 211)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '80%': {
            transform: 'scale(2.5) rotate(3deg)',
            filter: 'brightness(2) blur(1px)',
            textShadow: '0 0 3px rgba(192, 38, 211, 0.7)', // DEFAULT
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            filter: 'brightness(1) blur(0px)',
            textShadow: '0 0 2px rgba(192, 38, 211, 0.2)',
          },
        },
      },
      animation: {
        'score-pop': 'score-pop 0.3s ease-out',
        'streak-reset': 'streak-reset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'red-explosion': 'red-explosion 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'combo-explosion': 'combo-explosion 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        pulse: 'pulse 2s infinite alternate ease-in-out',
        float: 'float 6s infinite ease-in-out',
        shake: 'shake 0.5s infinite',
        'bounce-subtle': 'bounce-subtle 3s infinite ease-in-out',
        'mega-explosion': 'mega-explosion 1.5s cubic-bezier(0.2, 0, 0.4, 1)',
      },
      textShadow: {
        sm: '0 0 2px rgba(192, 38, 211, 0.2)',
        DEFAULT: '0 0 3px rgba(192, 38, 211, 0.7)',
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
