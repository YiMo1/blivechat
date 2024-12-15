import { createApp } from 'vue'
import app from './App.vue'
import { router } from './router/index.ts'
import 'element-plus/es/components/message/style/css'
import './style/index.css'

createApp(app).use(router).mount('#app')
