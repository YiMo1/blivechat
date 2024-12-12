import crypto from 'crypto'

export function getMd5Content(data: crypto.BinaryLike) {
  return crypto.createHash('md5').update(data).digest('hex')
}

export function getHmacSha256Content(data: crypto.BinaryLike) {
  return crypto.createHmac('sha256', process.env.ACCESS_KEY_SECRED).update(data).digest('hex')
}

export function getEncodeHeader(body = {}) {
  const timestamp = parseInt(`${Date.now()}`)
  const nonce = parseInt(`${Math.random() * 100000000}`) + timestamp
  const header = {
    'x-bili-accesskeyid': process.env.ACCESS_KEY_ID,
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
