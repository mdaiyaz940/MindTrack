/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Core surface palette ──
        stone: {
          25:  '#FDFCFB',
          50:  '#FAF9F7',
          75:  '#F5F3EF',
          100: '#EDE9E3',
          150: '#E2DDD6',
          200: '#D6D0C8',
          300: '#B8B0A6',
          400: '#9A9189',
          500: '#7C726A',
          600: '#5E554E',
          700: '#433D38',
          800: '#2B2723',
          900: '#1C1917',
          950: '#100E0C',
        },
        // ── Accent: Soft Indigo ──
        accent: {
          50:  '#EEEEF8',
          100: '#DCDCF2',
          200: '#BABAE5',
          300: '#9898D8',
          400: '#7676CB',
          500: '#5C6AC4',
          600: '#4B59B3',
          700: '#3D4A96',
          800: '#2F3878',
          900: '#22285A',
        },
        // ── Warm terracotta (mood) ──
        terracotta: {
          50:  '#FBF2ED',
          100: '#F6E3D7',
          200: '#ECC6AF',
          300: '#DFA987',
          400: '#D28C63',
          500: '#C27B56',
          600: '#A86448',
          700: '#8A4F3B',
          800: '#6B3B2D',
          900: '#4D2920',
        },
        // ── Sage green (journal / growth) ──
        sage: {
          50:  '#EDF3EF',
          100: '#DAE7DE',
          200: '#B5CEBD',
          300: '#91B59C',
          400: '#6C9C7B',
          500: '#5E8B72',
          600: '#4E7460',
          700: '#3E5D4E',
          800: '#2E463C',
          900: '#1E2F29',
        },
        // ── Muted rose (alerts / emotional) ──
        blush: {
          50:  '#F9ECED',
          100: '#F2D9DB',
          200: '#E5B3B7',
          300: '#D88D93',
          400: '#CB6770',
          500: '#B5606A',
          600: '#994F58',
          700: '#7D3E46',
          800: '#612E34',
          900: '#451F23',
        },
        // ── Dusty blue (analytics) ──
        slate: {
          25:  '#F8FAFC',
          50:  '#F1F5F9',
          75:  '#EAF0F6',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F172A',
          900: '#020617',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'card':  '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 24px 0 rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06)',
        'inner-sm': 'inset 0 1px 3px 0 rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};