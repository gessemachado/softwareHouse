/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bh-bg':            '#0d0d0d',
        'bh-surface':       '#161616',
        'bh-surface2':      '#242424',
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
        'bh-nav':           '#0d0d0d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
