// @ts-check
import { rmSync, existsSync } from 'node:fs'
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { nodeExternals } from 'rollup-plugin-node-externals'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { loadEnv, build, mergeConfig, defineConfig } from 'vite'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('production', resolve('../'), '')
const url = new URL(env.URL)

function rmDist() {
  const distPath = resolve('../dist')
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true })
  }
}

const sharedConfig = defineConfig({
  root: resolve('../'),
  resolve: { alias: { '@': resolve('../src') } },
  define: { __DEV__: JSON.stringify(false) },
  build: { emptyOutDir: false },
})

function buildClient() {
  const config = mergeConfig(sharedConfig, {
    plugins: [
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
    ],
    build: { outDir: 'dist/client' },
    define: { __BASE_URL__: JSON.stringify(url.origin + url.pathname) },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
  })
  return build(config)
}

function buildServer() {
  const config = mergeConfig(sharedConfig, {
    plugins: [{ ...nodeExternals({ deps: false }), name: 'node-externals', enforce: 'pre' }],
    define: {
      __ACCESS_KEY_ID__: JSON.stringify(env.ACCESS_KEY_ID),
      __ACCESS_KEY_SECRED__: JSON.stringify(env.ACCESS_KEY_SECRED),
      __PROJECT_ID__: JSON.stringify(env.PROJECT_ID),
      __CODE__: JSON.stringify(env.CODE),
      __PORT__: JSON.stringify(Number(url.port)),
      __BASE_URL__: JSON.stringify(url.pathname),
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve('../src/server/app.ts'),
        formats: ['cjs'],
        fileName: 'app',
      },
      copyPublicDir: false,
    },
    resolve: {
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  })
  return build(config)
}

function main() {
  rmDist()
  buildClient()
  buildServer()
}

main()
