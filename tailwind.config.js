/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a101f',
          900: '#101C35', // Deep Navy Primary
          800: '#182747',
          700: '#233863',
          600: '#2f4b85',
        },
        electric: {
          500: '#3878FF', // Electric Blue Secondary
          600: '#2663e6',
          700: '#1a4fc2',
        },
        orange: {
          500: '#FF8A35', // Vibrant Orange Accent
          600: '#e87420',
          700: '#c75c12',
        },
        offwhite: '#F5F7FC',
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3878FF',
          600: '#2663e6',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#101C35',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 28, 53, 0.06)',
        'glass': '0 8px 32px 0 rgba(16, 28, 53, 0.08)',
        'glass-lg': '0 16px 48px 0 rgba(16, 28, 53, 0.12)',
        'glow-blue': '0 0 25px rgba(56, 120, 255, 0.35)',
        'glow-orange': '0 0 25px rgba(255, 138, 53, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3878FF", // Electric Blue
          "primary-content": "#ffffff",
          "secondary": "#FF8A35", // Vibrant Orange
          "secondary-content": "#ffffff",
          "accent": "#101C35", // Deep Navy
          "neutral": "#101C35",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F5F7FC", // Soft Off-white
          "base-300": "#e2e8f0",
          "base-content": "#101C35",
          "info": "#3878FF",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#3878FF",
          "primary-content": "#ffffff",
          "secondary": "#FF8A35",
          "secondary-content": "#ffffff",
          "accent": "#60a5fa",
          "neutral": "#0b1324",
          "base-100": "#0a101f",
          "base-200": "#101C35",
          "base-300": "#182747",
          "base-content": "#F5F7FC",
          "info": "#3878FF",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
};
