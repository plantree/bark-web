module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './vueform.config.js',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'main': '#646cff'
      },
      form: (theme) => ({
        'primary': '#646cff',
      })
    },
  },
  plugins: [
    require('@vueform/vueform/tailwind'),
  ],
}
