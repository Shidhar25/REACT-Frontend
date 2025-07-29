module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#dc2626', // Emergency red
        secondary: '#6366f1', // Indigo
        accent: '#a21caf', // Purple
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'emergency': '0 4px 24px 0 rgba(220,38,38,0.15)',
      },
      backgroundImage: {
        'emergency-gradient': 'linear-gradient(90deg, #dc2626 0%, #a21caf 50%, #6366f1 100%)',
      },
    },
  },
  plugins: [],
}; 