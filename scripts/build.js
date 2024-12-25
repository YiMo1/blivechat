// @ts-check
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { loadEnv, build, mergeConfig, defineConfig } from 'vite'
import { nodeExternals } from 'rollup-plugin-node-externals'

import baseConfig from './baseConfig.js'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('production', resolve('../'), '')
const url = new URL(env.URL)

const clientConfig = mergeConfig(
  baseConfig(env, 'client'),
  defineConfig({
    define: { __DEV__: JSON.stringify(false), __BASE_URL__: JSON.stringify(url.origin + url.pathname) },
    build: { outDir: 'dist/client' },
  }),
)

const serverConfig = mergeConfig(
  baseConfig(env, 'server'),
  defineConfig({
    plugins: [{ ...nodeExternals({ deps: false }), name: 'node-externals', enforce: 'pre' }],
    define: {
      __DEV__: JSON.stringify(false),
      __PORT__: JSON.stringify(Number(url.port)),
      __BASE_URL__: JSON.stringify(url.pathname),
    },
    build: {
      outDir: 'dist/server',
      lib: {
        entry: resolve('../src/server/app.ts'),
        formats: ['cjs'],
        fileName: 'app',
      },
      copyPublicDir: false,
    },
    resolve: {
      mainFields: ['module', 'jsnext:main', 'jsnext'],
      conditions: ['node'],
    },
  }),
)

build({ ...clientConfig, configFile: false, envFile: false })
build({ ...serverConfig, configFile: false, envFile: false })
