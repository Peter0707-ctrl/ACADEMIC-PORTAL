import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        success: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          light: '#ECFDF3',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        slate: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
};

export default config;
