import animate from 'tailwindcss-animate';
import { fontFamily, spacing } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  safelist: ['lucide'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#edfcf5',
          100: '#d4f7e6',
          200: '#aceed2',
          300: '#6addb2',
          400: '#3ec999',
          500: '#1aaf81',
          600: '#0e8d69',
          700: '#0b7156',
          800: '#0b5a46',
          900: '#0a4a3a',
          950: '#052922',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['Roboto Mono', ...fontFamily.mono],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      maxWidth: spacing,
      minWidth: spacing,
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [animate],
};
