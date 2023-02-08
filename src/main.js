import { createApp } from 'vue'
import { createStore } from 'vuex'
import Vueform from '@vueform/vueform/plugin'
import vueformConfig from '../vueform.config'

import './style.css'
import App from './App.vue'

// create a new store instance
const store = createStore {
    state() {
        forms: {
            registration: {}
        }
    }
}
createApp(App).use(Vueform, vueformConfig).mount('#app')
