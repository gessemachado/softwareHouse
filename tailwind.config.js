/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bh-bg':            '#000000',
        'bh-surface':       '#0d0d0d',
        'bh-surface2':      '#1a1a1a',
        'bh-border':        '#2a2a2a',
        'bh-primary':       '#f97316',
        'bh-primary-hover': '#ea6c10',
        'bh-text':          '#ffffff',
        'bh-muted':         '#94a3b8',
        'bh-subtle':        '#64748b',
        'bh-success':       '#22c55e',
        'bh-success-bg':    '#14532d',
        'bh-danger':        '#ef4444',
        'bh-nav':           '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
