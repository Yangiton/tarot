import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vHoloFoil } from '@/directives/vHoloFoil'
import '@/styles/globals.css'

const app = createApp(App)
app.use(router)
app.directive('holo-foil', vHoloFoil)
app.mount('#app')
