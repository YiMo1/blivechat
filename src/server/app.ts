import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'

import router from './router.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.static(resolve(__dirname, 'client')))
app.use(__BASE_URL__, express.json())
app.use(__BASE_URL__, (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})
app.get('*', (_, res) => {
  res.sendFile(resolve(__dirname, 'client/index.html'))
})
app.use(__BASE_URL__, router)
app.listen(__PORT__, () => {
  console.log(`服务已在${__PORT__}端口启动...`)
})
