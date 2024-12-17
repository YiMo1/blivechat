import crypto from 'crypto'
import axios from 'axios'

function getMd5Content(data: crypto.BinaryLike) {
  return crypto.createHash('md5').update(data).digest('hex')
}

function getHmacSha256Content(data: crypto.BinaryLike) {
  return crypto.createHmac('sha256', __ACCESS_KEY_SECRED__).update(data).digest('hex')
}

function getEncodeHeader(body = {}) {
  const timestamp = parseInt(`${Date.now()}`)
  const nonce = parseInt(`${Math.random() * 100000000}`) + timestamp
  const header = {
    'x-bili-accesskeyid': __ACCESS_KEY_ID__,
    'x-bili-content-md5': getMd5Content(JSON.stringify(body)),
    'x-bili-signature-method': 'HMAC-SHA256',
    'x-bili-signature-nonce': `${nonce}`,
    'x-bili-signature-version': '1.0',
    'x-bili-timestamp': timestamp,
  }
  const data: string[] = []
  for (const [key, value] of Object.entries(header)) {
    data.push(`${key}:${value}`)
  }
  return {
    ...header,
    Authorization: getHmacSha256Content(data.join('\n')),
  }
}

const instance = axios.create({
  baseURL: 'https://live-open.biliapi.com',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

instance.interceptors.request.use((config) => {
  const encodeHeader = getEncodeHeader(config.data)
  for (const [key, value] of Object.entries(encodeHeader)) {
    config.headers.set(key, value)
  }
  return config
})

export function gameStart(code: string, appId: number) {
  return instance.post('/v2/app/start', { code, app_id: appId })
}

export function gameEnd(gameId: string, appId: number) {
  return instance.post('/v2/app/end', { app_id: appId, game_id: gameId })
}

export function heartbeat(gameId: string) {
  return instance.post('/v2/app/heartbeat', { game_id: gameId })
}
