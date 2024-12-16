import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/index.ts'
import { createPinia } from 'pinia'
import './style/index.ts'

const app = createApp(App).use(createPinia()).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
