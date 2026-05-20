import type { Config } from 'tailwindcss'

/**
 * Hot Chickz design system — "Street Heat"
 * A neon-lit, charcoal-dark, maximalist hot-chicken aesthetic.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm-tinted blacks, darkest to lightest
        char: '#100B09', // app background
        coal: '#19120F', // raised background / sections
        ash: '#231A15', // card surface
        soot: '#2E221C', // hairline borders / lifted surface

        // Flame ramp — the brand voice
        ember: {
          DEFAULT: '#E4231B', // primary red
          bright: '#FF3A2E',
          deep: '#A6160F',
        },
        molten: '#FF6A14', // orange
        flare: '#FFC230', // ember yellow / gold

        // Type
        bone: '#F7EEDD', // primary text (warm cream)
        smoke: '#A2938A', // muted text (warm gray)

        // Sparingly-used neon accent (signage glow, focus, "live")
        neon: '#FF2E88',

        // Heat-level ramp — recurring interactive motif
        heat: {
          none: '#74B49A',
          mild: '#FFC230',
          hot: '#FF6A14',
          blaze: '#E4231B',
          reaper: '#9A1140',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        heading: ['"Bricolage Grotesque"', 'ui-sans-serif', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ember: '0.14em',
        billboard: '0.02em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-ember': '0 0 30px -6px rgba(228,35,27,0.65)',
        'glow-molten': '0 0 34px -6px rgba(255,106,20,0.62)',
        'glow-flare': '0 0 28px -6px rgba(255,194,48,0.55)',
        'glow-neon': '0 0 26px -4px rgba(255,46,136,0.7)',
        plate: '0 30px 64px -28px rgba(0,0,0,0.92)',
        lift: '0 18px 44px -22px rgba(0,0,0,0.85)',
        'inset-ring': 'inset 0 0 0 1px rgba(247,238,221,0.07)',
      },
      backgroundImage: {
        grain: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        'flame-radial':
          'radial-gradient(58% 58% at 50% 38%, rgba(255,106,20,0.34) 0%, rgba(228,35,27,0.13) 46%, transparent 76%)',
        'ember-sweep':
          'linear-gradient(115deg, transparent 0%, rgba(255,194,48,0.16) 44%, rgba(255,255,255,0.4) 50%, rgba(255,194,48,0.16) 56%, transparent 100%)',
        'coal-fade': 'linear-gradient(180deg, #19120F 0%, #100B09 100%)',
      },
      keyframes: {
        flicker: {
          '0%, 18%, 22%, 25%, 53%, 57%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.38' },
        },
        'ember-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        smoke: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '22%': { opacity: '0.45' },
          '100%': { opacity: '0', transform: 'translateY(-130px) scale(1.8)' },
        },
        'heat-haze': {
          '0%, 100%': { transform: 'translateY(0) skewX(0deg)' },
          '50%': { transform: 'translateY(-2px) skewX(0.55deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
        drip: {
          '0%': { transform: 'translateY(-4px) scaleY(1)', opacity: '0' },
          '16%': { opacity: '1' },
          '82%': { opacity: '1' },
          '100%': { transform: 'translateY(22px) scaleY(1.45)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-130%)' },
          '58%, 100%': { transform: 'translateX(130%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'flame-dance': {
          '0%, 100%': { transform: 'scaleY(1) translateY(0)' },
          '25%': { transform: 'scaleY(1.09) translateY(-2px)' },
          '50%': { transform: 'scaleY(0.93) translateY(1px)' },
          '75%': { transform: 'scaleY(1.05) translateY(-1px)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(26px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        flicker: 'flicker 5s linear infinite',
        'ember-pulse': 'ember-pulse 3.4s ease-in-out infinite',
        smoke: 'smoke 7s ease-out infinite',
        'heat-haze': 'heat-haze 3.6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'marquee-rev': 'marquee-rev 38s linear infinite',
        float: 'float 7s ease-in-out infinite',
        drip: 'drip 3.6s ease-in infinite',
        'spin-slow': 'spin-slow 44s linear infinite',
        sheen: 'sheen 4.6s ease-in-out infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
        'flame-dance': 'flame-dance 1.7s ease-in-out infinite',
        rise: 'rise 0.7s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config
