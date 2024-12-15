import { createApp } from 'vue'
import app from './App.vue'
import { router } from './router/index.ts'
import './style/index.ts'

createApp(app).use(router).mount('#app')
