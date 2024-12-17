import axios from 'axios'

const instance = axios.create({
  baseURL: __BASE_URL__,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

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
  return instance.post<Result<Info>>('/start', { code })
}

export function endGame(gameId: string) {
  return instance.post<Result>('/end', { gameId })
}

export function keepHeartbeat(gameId: string) {
  return instance.post<Result>('/heartbeat', { gameId })
}
