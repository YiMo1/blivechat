import express from 'express'
import dotenv from 'dotenv'
import { resolve as _resolve } from 'node:path'

function resolve(...paths: string[]) {
  return _resolve(__dirname, ...paths)
}

function loadEnvFile() {
  const paths = ['../../../.env', '../../../.env.local'].map((path) => resolve(path))
  dotenv.config({ path: paths, override: true })
}

function main() {
  loadEnvFile()
}

main()

const router = express.Router()

router.get('/', (_, res) => {
  res.send('hello')
})

const app = express()
app.use(router)
app.listen(3000)
