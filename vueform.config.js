import en from '@vueform/vueform/locales/en'
import tailwind from '@vueform/vueform/themes/tailwind'

export default {
  theme: tailwind,
  locales: { en },
  locale: 'en',
  apiKey: 'pfsu-5fxw-vsk3-r4lp-fp3z',
  endpoints: {
    submit: {
      url: '/form/submit',
      method: 'post'
    }
  }
}