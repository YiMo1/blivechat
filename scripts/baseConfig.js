// @ts-check
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, mergeConfig } from 'vite'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}

/**
 * @param {Record<string, string>} env
 * @param {'client'|'server'} end
 */
export function getBaseConfig(env, end) {
  const sharedConfig = defineConfig({
    root: resolve('../'),
    define: {
      __ACCESS_KEY_ID__: JSON.stringify(env.ACCESS_KEY_ID),
      __ACCESS_KEY_SECRED__: JSON.stringify(env.ACCESS_KEY_SECRED),
      __PROJECT_ID__: JSON.stringify(env.PROJECT_ID),
      __CODE__: JSON.stringify(env.CODE),
      __PORT__: JSON.stringify(Number(env.PORT)),
      __BASE_URL__: JSON.stringify(env.BASE_URL),
    },
    resolve: { alias: { '@': resolve('../src') } },
  })

  const clientConfig = defineConfig({
    plugins: [
      vue(),
      jsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: false,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
      postcss: {
        plugins: [tailwindcss, autoprefixer()],
      },
    },
  })

  return end === 'client' ? mergeConfig(sharedConfig, clientConfig) : sharedConfig
}
