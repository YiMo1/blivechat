// @ts-check
import { loadEnv, build, mergeConfig, defineConfig } from 'vite'
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import baseConfig from './baseConfig.js'
import { nodeExternals } from 'rollup-plugin-node-externals'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('production', resolve('../'), '')

const clientConfig = mergeConfig(
  baseConfig(env, 'client'),
  defineConfig({
    define: { __DEV__: JSON.stringify(false) },
    build: { outDir: 'dist/client' },
  }),
)

const serverConfig = mergeConfig(
  baseConfig(env, 'server'),
  defineConfig({
    plugins: [{ ...nodeExternals({ deps: false }), name: 'node-externals', enforce: 'pre' }],
    define: { __DEV__: JSON.stringify(false) },
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
