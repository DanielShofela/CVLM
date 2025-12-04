import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './views/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        electric: {
          50: '#f0f7ff',
          100: '#e0effe',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Primary Electric Blue
          700: '#0369a1',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.65)',
          border: 'rgba(255, 255, 255, 0.5)',
          highlight: 'rgba(255, 255, 255, 0.8)',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon': '0 0 10px rgba(14, 165, 233, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  plugins: [],
} satisfies Config;
