import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A1A2E',
          light: '#2D2D44',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          warm: '#FFF8ED',
        },
        terra: {
          DEFAULT: '#C75B39',
          light: '#D97B5E',
          soft: '#FEF0EB',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#E0BE7A',
          soft: '#FDF6E8',
        },
        forest: {
          DEFAULT: '#166534',
          bg: '#DCFCE7',
        },
        border: '#E5E0D8',
        muted: '#6B7280',
        // Aliases pour compatibilité
        primary: '#C75B39',
        secondary: '#1A1A2E',
        accent: '#D4A853',
        // Anciennes couleurs gardées temporairement pour les portails Pro/Admin
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
        coral: {
          DEFAULT: '#E63946',
          soft: '#FFE0E3',
        },
        mint: {
          DEFAULT: '#06D6A0',
          soft: '#E0FFF5',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(26,26,46,0.06)',
        'card-lg': '0 8px 32px rgba(26,26,46,0.10)',
        'terra': '0 6px 24px rgba(199,91,57,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
