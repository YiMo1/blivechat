import axios from 'axios'
import { getEncodeHeader } from '../tools/index.ts'

axios.defaults.headers.common.Accept = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.baseURL = 'https://live-open.biliapi.com'

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
