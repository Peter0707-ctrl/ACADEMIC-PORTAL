import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Calibri', 'Candara', 'Segoe UI', 'Optima', 'Arial', 'sans-serif'],
        calibri: ['Calibri', 'Candara', 'Segoe UI', 'Optima', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#F3FAF5',
        card: '#FFFFFF',
        mint: {
          50: '#F5FAF6',
          100: '#EBF6EE',
          200: '#D5EDDB',
          300: '#B5DFC0',
          400: '#89CA9C',
          500: '#5FB378',
          600: '#43975C',
          700: '#34784B',
          800: '#2C603D',
          900: '#264F34',
        },
        slate: {
          DEFAULT: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
};

export default config;
