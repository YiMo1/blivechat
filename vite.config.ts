import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve as _resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import express from 'vite-plugin-express'
import { json } from 'express'

function resolve(...paths: string[]) {
  return _resolve(__dirname, ...paths)
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve('.'), '')

  return {
    plugins: [
      vue({ features: { optionsAPI: false } }),
      AutoImport({ resolvers: [ElementPlusResolver()], dts: false }),
      Components({ resolvers: [ElementPlusResolver()], dts: false }),
      express({ middlewareFiles: './src/server/router.ts', defaultMiddlewares: [json()], prefixUrl: env.BASE_URL }),
    ],
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      __ACCESS_KEY_ID__: JSON.stringify(env.ACCESS_KEY_ID),
      __ACCESS_KEY_SECRED__: JSON.stringify(env.ACCESS_KEY_SECRED),
      __PROJECT_ID__: JSON.stringify(env.PROJECT_ID),
      __CODE__: JSON.stringify(env.CODE),
      __BASE_URL__: JSON.stringify(env.BASE_URL),
    },
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
  }
})
