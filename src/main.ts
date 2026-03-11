import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vShine } from '@/directives/vShine'
import '@/styles/globals.css'

const app = createApp(App)
app.use(router)
app.directive('shine', vShine)
app.mount('#app')
