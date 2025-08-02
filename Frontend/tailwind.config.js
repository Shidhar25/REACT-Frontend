module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // 🚑 Ambulance Dashboard (cool green-based)
        ambulance: {
          dark: '#2D4739',
          DEFAULT: '#3A5543',
          light: '#88A596',
          tint: '#E6ECE8',
          success: '#2DA66D',
          danger: '#D95C5C',
          cta: '#3A5C47',
        },

        // 🔥 Fire Dashboard (warm red-orange theme)
        fire: {
          dark: '#7C1C1C',
          DEFAULT: '#B91C1C',
          light: '#F87171',
          tint: '#FDEDED',
          warning: '#FF8C42',
          intense: '#FF5722',
        },

        // 👮 Police Dashboard (deep navy + blue theme)
        police: {
          dark: '#1E293B',        // Navbar / Sidebar
          DEFAULT: '#3B82F6',     // Primary blue
          light: '#E0F2FE',       // Hover tint
          tint: '#E2E8F0',        // Card background
          warning: '#F59E0B',     // Amber alerts
          success: '#10B981',     // Status success
          danger: '#DC2626',      // Status danger
          text: '#111827',        // Headline text
          subtle: '#94A3B8',      // Borders / secondary text
        },

        // 🌐 Neutral base shared across dashboards
        neutral: {
          bg: '#E8E6E0',
          card: '#F7F6F2',
          placeholder: '#B0B0AC',
          text: '#333333',
        },

        // 🎨 Shared utility surfaces
        surface: {
          avatar: '#F3F2EF',
        },

        // 🎯 Legacy semantic (optional use)
        alert: {
          success: '#2DA66D',
          danger: '#D95C5C',
          cta: '#3A5C47',
        },

        // 🔗 Global primary theme (legacy/global gradients)
        primary: '#dc2626',      // Red
        secondary: '#6366f1',    // Indigo
        accent: '#a21caf',       // Purple
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      boxShadow: {
        emergency: '0 4px 24px 0 rgba(220,38,38,0.15)',
      },

      backgroundImage: {
        'emergency-gradient': 'linear-gradient(90deg, #dc2626 0%, #a21caf 50%, #6366f1 100%)',
        'fire-gradient': 'linear-gradient(to right, #B91C1C, #FF5722)',
        'ambulance-gradient': 'linear-gradient(to right, #3A5543, #88A596)',
        'police-gradient': 'linear-gradient(to right, #1E293B, #3B82F6)',
      },
    },
  },
  plugins: [],
};
