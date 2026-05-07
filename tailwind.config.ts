import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alpine: {
          fog:    '#F7F4EF',
          linen:  '#EDE7DC',
          stone:  '#C8B89A',
          bark:   '#9B7D5E',
          earth:  '#6B5240',
          forest: '#2D4A3E',
          deep:   '#1A2E28',
          night:  '#0F1C18',
          snow:   '#FAFAF7',
          gold:   '#C9A96E',
          amber:  '#D4944A',
          water:  '#7BA3A8',
          moss:   '#4A6741',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)',  'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe':    'breathe 6s ease-in-out infinite',
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fadeIn 1.2s ease forwards',
        'slow-zoom':  'slowZoom 20s ease-in-out infinite',
      },
      keyframes: {
        breathe:  { '0%,100%': { transform: 'scale(1)', opacity:'0.8' }, '50%': { transform:'scale(1.02)', opacity:'1' } },
        fadeUp:   { from: { opacity:'0', transform:'translateY(24px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:'0' }, to: { opacity:'1' } },
        slowZoom: { '0%,100%': { transform:'scale(1)' }, '50%': { transform:'scale(1.04)' } },
      },
    },
  },
  plugins: [],
}
export default config
