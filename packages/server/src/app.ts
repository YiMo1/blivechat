import * as express from 'express'

const router = express.Router()

router.get('/', (_, res) => {
  res.send('hello')
})

const app = express()
app.use(router)
app.listen(3000)
