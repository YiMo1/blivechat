import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve as _resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

function resolve(...paths: string[]) {
  return _resolve(__dirname, ...paths)
}

const env = loadEnv('', resolve('../../'), '')

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
  ],
  define: {
    BASE_URL: JSON.stringify(env.BASE_URL),
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})
