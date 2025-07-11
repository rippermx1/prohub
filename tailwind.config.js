/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    // Enhanced responsive container configuration
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    // Enhanced responsive breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Brand Colors from Logo
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main brand blue
          600: '#0284c7',
          700: '#0369a1', // Darker brand blue
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo accent
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        }
      },
      // Typography matching logo style
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace']
      },
      // Consistent spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Add responsive spacing helpers
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Enhanced responsive typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Responsive fluid typography
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 3vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 4vw, 1.5rem)',
        'fluid-xl': 'clamp(1.25rem, 5vw, 2rem)',
        'fluid-2xl': 'clamp(1.5rem, 6vw, 2.5rem)',
        'fluid-3xl': 'clamp(1.875rem, 7vw, 3rem)',
      },
      // Shadow system
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      // Border radius system
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      // Animation system
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addComponents, theme }) {
      addComponents({
        // Enhanced responsive button components
        '.btn': {
          '@apply inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-primary': {
          '@apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800': {},
        },
        '.btn-secondary': {
          '@apply btn bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700': {},
        },
        '.btn-accent': {
          '@apply btn bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 active:bg-accent-800': {},
        },
        '.btn-outline': {
          '@apply btn border-secondary-300 text-secondary-700 bg-white hover:bg-secondary-50 focus:ring-secondary-500 dark:border-secondary-600 dark:text-secondary-300 dark:bg-secondary-900 dark:hover:bg-secondary-800': {},
        },
        '.btn-ghost': {
          '@apply btn border-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-300 dark:hover:bg-secondary-800': {},
        },
        '.btn-sm': {
          '@apply px-3 py-1.5 text-xs': {},
        },
        '.btn-lg': {
          '@apply px-6 py-3 text-base': {},
        },
        '.btn-xl': {
          '@apply px-8 py-4 text-lg': {},
        },
        
        // Card Components
        '.card': {
          '@apply bg-white dark:bg-secondary-800 rounded-lg sm:rounded-xl shadow-card border border-secondary-200 dark:border-secondary-700 transition-all duration-200 p-4 sm:p-6': {},
        },
        '.card-hover': {
          '@apply card hover:shadow-card-hover hover:-translate-y-1': {},
        },
        '.card-interactive': {
          '@apply card-hover cursor-pointer hover:border-primary-300 dark:hover:border-primary-600': {},
        },
        
        // Input Components
        '.input': {
          '@apply block w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-secondary-300 rounded-lg shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base dark:bg-secondary-800 dark:border-secondary-600 dark:placeholder-secondary-500 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400': {},
        },
        '.input-sm': {
          '@apply px-2.5 py-1.5 text-sm': {},
        },
        '.input-lg': {
          '@apply px-4 py-3 text-lg': {},
        },
        
        // Badge Components
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply badge bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300': {},
        },
        '.badge-secondary': {
          '@apply badge bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300': {},
        },
        '.badge-success': {
          '@apply badge bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300': {},
        },
        '.badge-warning': {
          '@apply badge bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-300': {},
        },
        '.badge-error': {
          '@apply badge bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-300': {},
        },
        
        // Typography Components
        '.heading-xl': {
          '@apply text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-secondary-900 dark:text-white': {},
        },
        '.heading-lg': {
          '@apply text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-secondary-900 dark:text-white': {},
        },
        '.heading-md': {
          '@apply text-lg sm:text-xl lg:text-2xl font-heading font-semibold text-secondary-900 dark:text-white': {},
        },
        '.heading-sm': {
          '@apply text-base sm:text-lg lg:text-xl font-heading font-semibold text-secondary-900 dark:text-white': {},
        },
        '.heading-xs': {
          '@apply text-lg font-heading font-medium text-secondary-900 dark:text-white': {},
        },
        
        // Text Components
        '.text-body': {
          '@apply text-base text-secondary-700 dark:text-secondary-300': {},
        },
        '.text-caption': {
          '@apply text-sm text-secondary-600 dark:text-secondary-400': {},
        },
        '.text-muted': {
          '@apply text-secondary-500 dark:text-secondary-500': {},
        },
        
        // Layout Components
        '.container-app': {
          '@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        '.section-padding': {
          '@apply py-8 sm:py-12 lg:py-16 xl:py-20': {},
        },
        
        // Animation helpers
        '.animate-in': {
          '@apply animate-fade-in-up': {},
        },
        '.hover-lift': {
          '@apply transition-all duration-200 hover:-translate-y-1 hover:shadow-lg': {},
        },
        '.hover-scale': {
          '@apply transition-transform duration-200 hover:scale-105': {},
        },
        
        // Mobile-specific utilities
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
      })
    }
  ],
}

