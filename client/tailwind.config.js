// tailwind.config.ts

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // === FONT FAMILY - ZERODHA EXACT ===
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        inter: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },

      // === COLORS - Keep yours + Add Zerodha precision ===
      colors: {
        // Your existing (keep all!)
        'deep-charcoal': { DEFAULT: '#000000', dark: '#1B1B1B', light: '#F9FAFB' },
        'card-dark': { DEFAULT: '#2D3748', dark: '#2D3748', light: '#FFFFFF' },
        'near-black': { DEFAULT: '#1A202C', dark: '#1A202C', light: '#E5E7EB' },
        'cool-white': { DEFAULT: '#FFFFFF', dark: '#FFFFFF', light: '#FFFFFF' },
        'teal-green': { DEFAULT: '#22C55E', dark: '#22C55E', light: '#22C55E' },
        'electric-orange': { DEFAULT: '#FF9800', dark: '#FF9800', light: '#F97316' },
        'text-primary': { DEFAULT: '#E2E8F0', dark: '#E2E8F0', light: '#111827' },
        'text-secondary': { DEFAULT: '#A0AEC0', dark: '#A0AEC0', light: '#6B7280' },
        'border-gray-dark': '#393939',

        // === NEW: Zerodha-Exact Shades (Safe to Add) ===
        border: {
          DEFAULT: '#2D3748',     // Card borders
          light: '#E2E8F0',       // Light mode
          dark: '#2D3748',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',   // Labels (Zerodha's main gray)
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },

      // === FONT WEIGHTS - Zerodha Uses These ===
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      spacing: {
        '4.5': '1.125rem',  // For py-4.5, px-4.5 etc.
        '5.5': '1.375rem',
        '7': '1.75rem',
        '9': '2.25rem',
      },

      // === BORDER RADIUS - Zerodha Style ===
      borderRadius: {
        lg: '0.5rem',    // Cards
        xl: '0.75rem',   // Modals
        '2xl': '1rem',   // Larger cards
        '3xl': '1.5rem', // Profile header
      },

      // === YOUR ANIMATIONS - Keep 100% ===
      keyframes: {
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-line': {
          from: { 'stroke-dasharray': '0 1000', 'stroke-dashoffset': '1000' },
          to: { 'stroke-dasharray': '1000 1000', 'stroke-dashoffset': '0' },
        },
        'price-flash-green': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(34,197,94,0.25)' },
        },
        'price-flash-red': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239,68,68,0.25)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.25s ease-out',
        'draw-line': 'draw-line 2s ease-out forwards',
        'price-flash-green': 'price-flash-green 0.6s ease-in-out',
        'price-flash-red': 'price-flash-red 0.6s ease-in-out',
      },

      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
} 