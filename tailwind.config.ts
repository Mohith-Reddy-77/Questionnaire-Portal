import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ready: {
          coral: '#e11d48',
          orange: '#f97316',
          amber: '#f59e0b',
          blue: '#0ea5e9',
          indigo: '#6366f1',
          slate: '#0f172a',
          darkBg: '#0b0f19',
          darkCard: '#111827',
        },
      },
      boxShadow: {
        glow: '0 24px 70px rgba(15, 23, 42, 0.18)',
        'coral-glow': '0 10px 40px -10px rgba(225, 29, 72, 0.35)',
        'orange-glow': '0 10px 40px -10px rgba(249, 115, 22, 0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 25%), radial-gradient(circle at right, rgba(245, 158, 11, 0.16), transparent 22%), linear-gradient(135deg, #07111f 0%, #0f172a 42%, #1e293b 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
