import { createApp } from 'vue'
import { createStore } from 'vuex'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

import './style.css'
import App from './App.vue'

// create a new store instance
const store = createStore({
    state() {
        return {
            form: JSON.parse(sessionStorage.getItem('REGISTRATION')) || {}
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
    .use(plugin, defaultConfig)
    .mount('#app')
