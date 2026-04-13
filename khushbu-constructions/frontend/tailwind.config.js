/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        // ✅ Brand colors (custom — OK)
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        // ❌ REMOVED THIS (IMPORTANT FIX)
        // amber: '#F59E0B',

        // ✅ Surface system
        surface: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#EFEFEF',
          300: '#E5E5E5',
          400: '#D4D4D4',
        },

        // ✅ Text system
        ink: {
          900: '#1A1A1A',
          700: '#374151',
          500: '#6B7280',
          300: '#9CA3AF',
        },

        // ✅ Sidebar
        sidebar: '#1E293B',
        'sidebar-hover': '#334155',
        'sidebar-active': '#F59E0B',
      },

      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.06)',
        brand: '0 4px 14px rgba(245,158,11,0.35)',
        nav: '0 1px 0 rgba(0,0,0,0.06)',
        admin: '2px 0 8px rgba(0,0,0,0.08)',
      },

      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        count: 'count 2s ease-out forwards',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  plugins: [],
};