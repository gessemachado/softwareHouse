/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bh-bg':            '#000000',
        'bh-surface':       '#141414',
        'bh-surface2':      '#1a1a1a',
        'bh-border':        '#292929',
        'bh-primary':       '#ff6600',
        'bh-primary-hover': '#e55a00',
        'bh-secondary':     '#008080',
        'bh-text':          '#fafafa',
        'bh-muted':         '#999999',
        'bh-subtle':        '#666666',
        'bh-success':       '#22c55e',
        'bh-success-bg':    '#14532d',
        'bh-danger':        '#dc2828',
        'bh-nav':           '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
