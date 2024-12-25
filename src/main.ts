import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router/index.ts'
import './style/index.ts'

createApp(App).use(createPinia()).use(router).mount('#app')
