import type { Config } from 'tailwindcss';
// Design tokens live here (single source) — consumed everywhere; no per-component magic numbers.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: { 50: '#F6F3FA', 100: '#EDE7F4', 200: '#DCD1EA', 300: '#C4B3DB', 400: '#A98FC8' },
        lilac: { DEFAULT: '#B99CD6', deep: '#9A78C2' },
        ivory: { DEFAULT: '#FBF8F3', warm: '#F5EFE6' },
        champagne: { DEFAULT: '#E3C9A3', deep: '#CDAA74' },
        plum: { DEFAULT: '#3B2547', soft: '#5A3F68', mute: '#8A7494' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(59,37,71,0.15)',
        glow: '0 0 0 1px rgba(185,156,214,0.45), 0 8px 30px -10px rgba(185,156,214,0.5)',
      },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};
export default config;
