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
          dark: '#2D4739',        // Sidebar icons / deep accent
          DEFAULT: '#3A5543',     // Buttons / headers
          light: '#88A596',       // Highlights / muted indicators
          tint: '#E6ECE8',        // Card backgrounds
          success: '#2DA66D',     // Success actions
          danger: '#D95C5C',      // Errors
          cta: '#3A5C47',         // CTA button
        },

        // 🔥 Fire Dashboard (warm red-orange theme)
        fire: {
          dark: '#7C1C1C',         // Deep accent
          DEFAULT: '#B91C1C',      // Primary red
          light: '#F87171',        // Muted alerts
          tint: '#FDEDED',         // Card backgrounds / light surfaces
          warning: '#FF8C42',      // Orange highlight
          intense: '#FF5722',      // CTA or active danger
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

        // 🔗 Global primary theme (for gradients/legacy components)
        primary: '#dc2626',       // Red (used in gradients)
        secondary: '#6366f1',     // Indigo
        accent: '#a21caf',        // Purple
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },

      boxShadow: {
        emergency: '0 4px 24px 0 rgba(220,38,38,0.15)', // Red glow
      },

      backgroundImage: {
        'emergency-gradient': 'linear-gradient(90deg, #dc2626 0%, #a21caf 50%, #6366f1 100%)',
        'fire-gradient': 'linear-gradient(to right, #B91C1C, #FF5722)', // For fire callouts
        'ambulance-gradient': 'linear-gradient(to right, #3A5543, #88A596)',
      },
    },
  },
  plugins: [],
};
