/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bh-bg':            'rgb(var(--bh-bg) / <alpha-value>)',
        'bh-surface':       'rgb(var(--bh-surface) / <alpha-value>)',
        'bh-surface2':      'rgb(var(--bh-surface2) / <alpha-value>)',
        'bh-border':        'rgb(var(--bh-border) / <alpha-value>)',
        'bh-primary':       'rgb(var(--bh-primary) / <alpha-value>)',
        'bh-primary-hover': 'rgb(var(--bh-primary-hover) / <alpha-value>)',
        'bh-secondary':     'rgb(var(--bh-secondary) / <alpha-value>)',
        'bh-text':          'rgb(var(--bh-text) / <alpha-value>)',
        'bh-muted':         'rgb(var(--bh-muted) / <alpha-value>)',
        'bh-subtle':        'rgb(var(--bh-subtle) / <alpha-value>)',
        'bh-success':       'rgb(var(--bh-success) / <alpha-value>)',
        'bh-success-bg':    'rgb(var(--bh-success-bg) / <alpha-value>)',
        'bh-danger':        'rgb(var(--bh-danger) / <alpha-value>)',
        'bh-nav':           'rgb(var(--bh-nav) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
