import express from 'express'

import router from './router.ts'

const app = express()
app.use(express.json())
if (__DEV__) {
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    next()
  })
}
app.use(router)
app.listen(3000)
