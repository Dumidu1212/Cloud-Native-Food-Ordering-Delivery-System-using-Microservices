/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5E6',
          100: '#FFE6BF',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#FF8000', // Primary orange
          600: '#CC6600',
          700: '#994C00',
          800: '#663300',
          900: '#331900',
        },
        secondary: {
          50: '#E6F7EF',
          100: '#CCEFE0',
          200: '#99DFC0',
          300: '#66CFA1',
          400: '#33BF81',
          500: '#00C853', // Secondary green
          600: '#00A243',
          700: '#007A32',
          800: '#005121',
          900: '#002911',
        },
        accent: {
          50: '#FFECE5',
          100: '#FFD9CC',
          200: '#FFB399',
          300: '#FF8C66',
          400: '#FF6633',
          500: '#FF3D00', // Accent red
          600: '#CC3100',
          700: '#992500',
          800: '#661800',
          900: '#330C00',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-once': 'pulse 2s ease-in-out 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}