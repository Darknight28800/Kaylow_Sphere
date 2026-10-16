import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette officielle — anciennement Charte SphereWeb v2.0 (§2.1), Kaylow Sphere
        navy: {
          DEFAULT: '#050B2B', // Fond principal — bleu profond (aligné portfolio)
          800: '#0A1238', // Surfaces surélevées
          700: '#141D52', // Bordures / survols
        },
        brand: {
          DEFAULT: '#5B3DF6', // Violet-indigo — boutons, liens, titres
          600: '#4c30e0',
          400: '#7b62f8',
        },
        accent: {
          DEFAULT: '#5B8CFF', // Bleu électrique du logo — accents, survols, icônes
          600: '#3D6BF5',
        },
        neutraltxt: '#8B93A7', // Gris neutre — sous-titres, légendes (contraste AA sur navy)
        mist: '#F4F5F7', // Gris très clair — sections claires, cartes
        ink: '#1F2937', // Texte courant sur fond clair
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '92rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.055)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'spin-slow': 'spin 35s linear infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        glow: 'glow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
