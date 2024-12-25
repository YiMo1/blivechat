// @ts-check
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnv, createServer, mergeConfig, defineConfig } from 'vite'
import express from 'vite-plugin-express'

import baseConfig from './baseConfig.js'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('development', resolve('../'), '')

const config = mergeConfig(
  baseConfig(env, 'client'),
  defineConfig({
    plugins: [express({ middlewareFiles: 'src/server/router.ts' })],
    define: { __DEV__: JSON.stringify(true), __BASE_URL__: JSON.stringify('/api') },
  }),
)

const server = await createServer({
  ...config,
  configFile: false,
  envFile: false,
})

await server.listen()

server.printUrls()
