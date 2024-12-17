// @ts-check
import { loadEnv, createServer, mergeConfig, defineConfig } from 'vite'
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import baseConfig from './baseConfig.js'
import express from 'vite-plugin-express'
import { json } from 'express'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('development', resolve('../'), '')

const config = mergeConfig(
  baseConfig(env, 'client'),
  defineConfig({
    plugins: [
      express({ middlewareFiles: 'src/server/router.ts', defaultMiddlewares: [json()], prefixUrl: env.BASE_URL }),
    ],
    define: { __DEV__: JSON.stringify(true) },
  }),
)

const server = await createServer({
  ...config,
  configFile: false,
  envFile: false,
})

await server.listen()

server.printUrls()
