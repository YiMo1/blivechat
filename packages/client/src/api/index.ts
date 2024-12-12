import axios from 'axios'

axios.defaults.baseURL = BASE_URL
axios.defaults.headers.common.Accept = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export interface Info {
  game_info: { game_id: string }
  websocket_info: { auth_body: string; wss_link: string[] }
  anchor_info: { room_id: number; uname: string; uface: string; uid: number; open_id: string }
}

interface Result<T = object> {
  code: number
  data: T
  message: string
  request_id: string
}

export function startGame(code: string) {
  return axios.post<Result<Info>>('/start', { code })
}

export function endGame(gameId: string) {
  return axios.post<Result>('/end', { gameId })
}

export function keepHeartbeat(gameId: string) {
  return axios.post<Result>('/heartbeat', { gameId })
}
