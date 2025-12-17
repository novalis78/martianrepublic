/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Mars palette - warm, dusty, authoritative
        mars: {
          50: '#fef7f0',
          100: '#fdecd9',
          200: '#fad5b1',
          300: '#f6b780',
          400: '#f1914d',
          500: '#ed7426',
          600: '#de5a1c',
          700: '#b84419',
          800: '#93371c',
          900: '#77301a',
          950: '#40160b',
          // Named variants for semantic use
          surface: '#1a0f0a',
          rust: '#c1440e',
          dust: '#d8a172',
          oxide: '#8b3a1a',
          soil: '#2c1b0e',
        },
        // Cold tech accents - for data, links, active states
        colony: {
          cyan: '#00d4ff',
          teal: '#14b8a6',
          green: '#22c55e',
          amber: '#f59e0b',
        },
        // Deep space neutrals
        void: {
          900: '#0a0806',
          800: '#0f0c09',
          700: '#1a1512',
          600: '#2a221c',
          500: '#3d3229',
          400: '#5c4d3f',
          300: '#8b7355',
          200: '#b8a07d',
          100: '#d9c9ad',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
        '11xl': ['12rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        ultrawide: '0.25em',
      },
      animation: {
        'scan-line': 'scan-line 8s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-down': 'slide-down 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'data-stream': 'data-stream 20s linear infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
          '50%': { opacity: '0.8', filter: 'blur(30px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'data-stream': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-opacity='0.03'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'mars-gradient': 'linear-gradient(135deg, #1a0f0a 0%, #2c1b0e 50%, #0a0806 100%)',
        'hero-radial': 'radial-gradient(ellipse at center bottom, #3d1a0a 0%, #1a0f0a 50%, #0a0806 100%)',
      },
      boxShadow: {
        'glow-mars': '0 0 40px -10px rgba(193, 68, 14, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(0, 212, 255, 0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'brutal': '4px 4px 0 0 rgba(193, 68, 14, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
