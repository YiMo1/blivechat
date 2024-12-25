// @ts-check
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
/**
 * @param {Record<string, string>} env
 * @param {'client'|'server'} mode
 */
export default (env, mode) => {
  return defineConfig({
    root: resolve('../'),
    plugins:
      mode === 'client'
        ? [
            vue(),
            jsx(),
            AutoImport({
              resolvers: [ElementPlusResolver()],
              dts: false,
              imports: [{ '@/component/index.ts': ['EmojiText'] }],
              defaultExportByFilename: true,
            }),
            Components({
              resolvers: [ElementPlusResolver()],
              dirs: [resolve('../src/component')],
              dts: false,
            }),
          ]
        : [],
    define: {
      __ACCESS_KEY_ID__: JSON.stringify(env.ACCESS_KEY_ID),
      __ACCESS_KEY_SECRED__: JSON.stringify(env.ACCESS_KEY_SECRED),
      __PROJECT_ID__: JSON.stringify(env.PROJECT_ID),
      __CODE__: JSON.stringify(env.CODE),
    },
    resolve: { alias: { '@': resolve('../src') } },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  })
}
