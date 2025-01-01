// @ts-check
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnv, createServer, mergeConfig, defineConfig } from 'vite'
import express from 'vite-plugin-express'

import { getBaseConfig } from './baseConfig.js'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('development', resolve('../'), '')

const config = mergeConfig(
  getBaseConfig(env, 'client'),
  defineConfig({
    plugins: [express({ middlewareFiles: 'src/server/router.ts', prefixUrl: env.BASE_URL })],
    define: { __DEV__: JSON.stringify(true) },
  }),
)

const server = await createServer(config)

await server.listen()

server.printUrls()
