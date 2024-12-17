import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/index.ts'
import { createPinia } from 'pinia'
import './style/index.ts'

createApp(App).use(createPinia()).use(router).mount('#app')
