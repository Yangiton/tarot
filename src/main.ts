import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from '@/i18n'
import { vHoloFoil } from '@/directives/vHoloFoil'
import '@/styles/globals.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('holo-foil', vHoloFoil)
app.mount('#app')
