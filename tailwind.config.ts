import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [
    plugin(({ addUtilities, addBase }) => {
      addBase({
        '::-webkit-scrollbar': {
          display: 'var(--scrollbar-display, block)',
        },
      })
      addUtilities({
        '.scrollbar-hidden': {
          '--scrollbar-display': 'none',
        },
      })
    }),
  ],
} satisfies Config
