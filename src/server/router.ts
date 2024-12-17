import { Router } from 'express'
import { isString } from '../tool/index.ts'
import { gameStart, heartbeat, gameEnd } from './request.ts'

const router = Router()

router.post('/start', async (req, res) => {
  const code = __DEV__ ? __CODE__ : req.body.code
  if (!isString(code)) {
    res.send({ code: 4000, msg: '参数错误', data: null })
    return
  }
  const result = await gameStart(code, Number(__PROJECT_ID__))
  res.send(result.data)
})

router.post('/end', async (req, res) => {
  const gameId = req.body.gameId
  if (!isString(gameId)) {
    res.send({ code: 4000, msg: '参数错误', data: null })
    return
  }
  const result = await gameEnd(gameId, Number(__PROJECT_ID__))
  res.send(result.data)
})

router.post('/heartbeat', async (req, res) => {
  const gameId = req.body.gameId
  if (!isString(gameId)) {
    res.send({ code: 4000, msg: '参数错误', data: null })
    return
  }
  const result = await heartbeat(gameId)
  res.send(result.data)
})

export default router
