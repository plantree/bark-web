import { createApp } from 'vue'
import Vueform from '@vueform/vueform/plugin'
import vueformConfig from '../vueform.config'

import './style.css'
import App from './App.vue'

createApp(App).use(Vueform, vueformConfig).mount('#app')
