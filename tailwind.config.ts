import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sun: {
          DEFAULT: '#FF6B35',
          light: '#FF8F5E',
          glow: '#FFF0E8',
        },
        ocean: {
          DEFAULT: '#0077B6',
          deep: '#005A8C',
          light: '#00B4D8',
          pale: '#E8F7FC',
        },
        sky: '#48CAE4',
        sand: {
          DEFAULT: '#FEFCF3',
          warm: '#FFF8ED',
        },
        coral: {
          DEFAULT: '#E63946',
          soft: '#FFE0E3',
        },
        mint: {
          DEFAULT: '#06D6A0',
          soft: '#E0FFF5',
        },
        violet: '#7B2FF7',
        dark: {
          DEFAULT: '#0A1628',
          mid: '#142438',
        },
        primary: '#FF6B35',
        secondary: '#0077B6',
        accent: '#7B2FF7',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(10,22,40,0.08)',
        'card-lg': '0 16px 48px rgba(10,22,40,0.14)',
        'sun': '0 8px 32px rgba(255,107,53,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
