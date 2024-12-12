import express from 'express'
import { isString } from 'shared'
import { gameEnd, gameStart, heartbeat } from '../api/index.ts'

export const router = express.Router()

router.post('/start', async (req, res) => {
  const code = process.env.NODE_ENV === 'development' ? process.env.CODE : req.body.code
  if (!isString(code)) {
    res.send({ code: 4000, msg: '参数错误', data: null })
    return
  }
  const result = await gameStart(code, Number(process.env.PROJECT_ID))
  res.send(result.data)
})

router.post('/end', async (req, res) => {
  const gameId = req.body.gameId
  if (!isString(gameId)) {
    res.send({ code: 4000, msg: '参数错误', data: null })
    return
  }
  const result = await gameEnd(gameId, Number(process.env.PROJECT_ID))
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
