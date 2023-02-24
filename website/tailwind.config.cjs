const fontFamily = `'Cormorant', 'serif'`

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway'],
        header: ['Cormorant']
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            h1: { fontFamily },
            h2: { fontFamily },
            h3: { fontFamily },
            h4: { fontFamily },
            h5: { fontFamily },
            h6: { fontFamily },
            '--tw-prose-pre-code': theme('colors.gray[800]'),
            '--tw-prose-pre-bg': theme('colors.gray[100]')
          }
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
