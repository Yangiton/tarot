import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from '@/i18n'
import '@/styles/design-tokens.css'
import '@/styles/globals.css'

// hover-tilt Web Component 注册
// 注意：不导入 hover-tilt/vue，因为它的类型定义会覆盖 Vue 导出
// 使用 vite.config.ts 的 isCustomElement 配置代替
import 'hover-tilt/web-component'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
