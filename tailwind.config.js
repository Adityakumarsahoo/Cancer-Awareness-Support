export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: '#0ea5e9',
          teal: '#14b8a6',
          indigo: '#4f46e5',
        },
      },
      boxShadow: {
        'brand-xl': '0 30px 60px rgba(10,42,74,0.18), 0 10px 24px rgba(10,42,74,0.12)',
      },
      transitionTimingFunction: {
        'out-curve': 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
}