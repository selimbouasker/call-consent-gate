/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0B0D',
        panel: '#14161A',
        raised: '#1B1E22',
        hairline: '#26292E',
        ink: '#F4F1EA',
        'ink-muted': '#9B9DA3',
        brass: '#C98A3E',
        'brass-dim': '#5C4526',
        slate: '#7C8591',
        'slate-dim': '#2B2F35',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Public Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
