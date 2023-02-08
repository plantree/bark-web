import { createApp } from 'vue'
import { createStore } from 'vuex'
import Vueform from '@vueform/vueform/plugin'
import vueformConfig from '../vueform.config'

import './style.css'
import App from './App.vue'

// create a new store instance
const store = createStore({
    state() {
        return {
            forms: {
                registration: JSON.parse(sessionStorage.getItem('REGISTRATION')) || {},
            }
        }
    },
    mutations: {
        UPDATE_FROM_DATA(state, value) {
            sessionStorage.setItem('REGISTRATION', JSON.stringify(value.data))
        }
    }
})

createApp(App)
    .use(store)
    .use(Vueform, vueformConfig)
    .mount('#app')
