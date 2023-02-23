const fontFamily = `'Cormorant', 'serif'`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans'],
        header: ['Cormorant']
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { fontFamily },
            h2: { fontFamily },
            h3: { fontFamily },
            h4: { fontFamily },
            h5: { fontFamily },
            h6: { fontFamily }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
