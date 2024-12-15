import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve as _resolve } from 'node:path'

function resolve(...paths: string[]) {
  return _resolve(__dirname, ...paths)
}

const env = loadEnv('', resolve('../../'), '')

export default defineConfig({
  plugins: [vue()],
  define: {
    BASE_URL: JSON.stringify(env.BASE_URL),
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})
