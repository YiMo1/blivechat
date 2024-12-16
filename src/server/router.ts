import { Router } from 'express'
import { isString } from '../tool/index.ts'
import _axios from 'axios'

const axios = _axios.create({
  baseURL: 'https://live-open.biliapi.com',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

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

import { getEncodeHeader } from '../tool/index.ts'

axios.interceptors.request.use((config) => {
  const encodeHeader = getEncodeHeader(config.data)
  for (const [key, value] of Object.entries(encodeHeader)) {
    config.headers.set(key, value)
  }
  return config
})

export function gameStart(code: string, appId: number) {
  return axios.post('/v2/app/start', { code, app_id: appId })
}

export function gameEnd(gameId: string, appId: number) {
  return axios.post('/v2/app/end', { app_id: appId, game_id: gameId })
}

export function heartbeat(gameId: string) {
  return axios.post('/v2/app/heartbeat', { game_id: gameId })
}
