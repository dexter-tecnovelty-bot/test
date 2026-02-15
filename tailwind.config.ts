import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
          neutral: '#475569',
          background: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['3rem', { lineHeight: '3.75rem', fontWeight: '700' }],
        h2: ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700' }],
        h3: ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        cta: ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
      },
      spacing: {
        'section-mobile': '3rem',
        section: '4rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
