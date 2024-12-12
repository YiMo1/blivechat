import express from 'express'
import dotenv from 'dotenv'
import { resolve as _resolve } from 'node:path'
import { router } from './router/index.ts'

function resolve(...paths: string[]) {
  return _resolve(__dirname, ...paths)
}

function loadEnvFile() {
  const paths = ['../../../.env', '../../../.env.local'].map((path) => resolve(path))
  dotenv.config({ path: paths, override: true })
}

function main() {
  loadEnvFile()
  const app = express()
  app.use(express.json())
  if (process.env.NODE_ENV === 'development') {
    app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Methods', '*')
      next()
    })
  }
  app.use(router)
  app.listen(3000)
}

main()
