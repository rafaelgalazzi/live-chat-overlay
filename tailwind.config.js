/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4B5563', // Neutral gray
        secondary: '#6B7280', // Cool gray
        accent: '#9CA3AF', // Gray accent
        dark: '#111827', // Dark gray for background
        darkAlt: '#1F2937', // Alternative dark
        light: '#F9FAFB', // Light gray for contrast

        // Text
        textPrimary: '#F3F4F6', // Light gray
        textSecondary: '#D1D5DB', // Cool gray
        textAccent: '#9CA3AF', // Gray accent

        // States
        success: '#10B981', // Emerald green
        warning: '#F59E0B', // Amber
        error: '#EF4444', // Red
        spinnerColor: '#9CA3AF',
        cardBackground: 'rgba(31, 41, 55, 0.8)', // darkAlt with 80% opacity
        cardBackgroundLight: 'rgba(55, 65, 81, 0.6)', // lighter tone with transparency
        navbar: '#1F2937', // Dark gray navbar
        footer: '#1F2937', // Dark gray footer
        gradientColor1: '#111827',
        gradientColor2: '#1F2937',
        link: '#8d8dff',
      },
      backgroundImage: {
        'gradient-dark':
          'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)',
        'gradient-accent':
          'linear-gradient(135deg, #4B5563 0%, #6B7280 50%, #9CA3AF 100%)',
        'gradient-navbar':
          'linear-gradient(90deg, #374151 0%, #4B5563 50%, #6B7280 100%)',
        'gradient-footer':
          'linear-gradient(90deg, #4B5563 0%, #374151 50%, #1F2937 100%)',
        'gradient-navbar-dark':
          'linear-gradient(90deg, #1F2937 0%, #111827 100%)',
      },
      boxShadow: {
        glow: '0 0 8px rgba(156, 163, 175, 0.3), 0 0 15px rgba(107, 114, 128, 0.2)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
};
