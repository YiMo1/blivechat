// @ts-check
import { rmSync, existsSync } from 'node:fs'
import { resolve as _resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { nodeExternals } from 'rollup-plugin-node-externals'
import { loadEnv, build, mergeConfig, defineConfig } from 'vite'

import { getBaseConfig } from './baseConfig.js'

const __dirname = fileURLToPath(dirname(import.meta.url))
/** @param {string[]} paths */
function resolve(...paths) {
  return _resolve(__dirname, ...paths)
}
const env = loadEnv('production', resolve('../'), '')

function rmDist() {
  const distPath = resolve('../dist')
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true })
  }
}

const sharedConfig = defineConfig({ define: { __DEV__: JSON.stringify(false) }, build: { emptyOutDir: false } })

function buildClient() {
  const baseConfig = mergeConfig(getBaseConfig(env, 'client'), sharedConfig)
  const config = mergeConfig(mergeConfig(baseConfig, sharedConfig), {
    build: { outDir: 'dist/client' },
  })
  return build(config)
}

function buildServer() {
  const baseConfig = mergeConfig(getBaseConfig(env, 'server'), sharedConfig)
  const config = mergeConfig(baseConfig, {
    plugins: [{ ...nodeExternals({ deps: false }), name: 'node-externals', enforce: 'pre' }],
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
