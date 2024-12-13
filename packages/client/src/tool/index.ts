import { isString } from 'shared'
import { inflate } from 'pako'
import type * as WS from '../types/index.d.ts'

export const INFO_SESSION_STORAGE_KEY = 'BLIVECHAT_INFO'
export const PROJECT_HEARBEAT_INTERVAL = 1000 * 20
export const WS_HEARBEAT_INTERVAL = 1000 * 30
export const HEADER_SIZE = 16

export enum OPERATION {
  OP_HEARTBEAT = 2,
  OP_HEARTBEAT_REPLY = 3,
  OP_SEND_SMS_REPLY = 5,
  OP_AUTH = 7,
  OP_AUTH_REPLY = 8,
}

export enum VERSION {
  ACTUAL = 0,
  COMPRESSED = 2,
}

export enum GUARD_LEVEL {
  NONE = 0,
  GOVERNOR = 1,
  ADMIRAL = 2,
  CAPTAIN = 3,
}

export enum DM_TYPE {
  NORMAL = 0,
  EMOJI = 1,
}

export enum CMD {
  CHAT = 'LIVE_OPEN_PLATFORM_DM',
  GIFT = 'LIVE_OPEN_PLATFORM_SEND_GIFT',
  SUPER_CHAT = 'LIVE_OPEN_PLATFORM_SUPER_CHAT',
  SUPER_CHAT_OFFLINE = 'LIVE_OPEN_PLATFORM_SUPER_CHAT_DEL',
  GUARD = 'LIVE_OPEN_PLATFORM_GUARD',
  LIKE = 'LIVE_OPEN_PLATFORM_LIKE',
  ENTER_ROOM = 'LIVE_OPEN_PLATFORM_LIVE_ROOM_ENTER',
  LIVE_START = 'LIVE_OPEN_PLATFORM_LIVE_START',
  LIVE_END = 'LIVE_OPEN_PLATFORM_LIVE_END',
  INTERACTION_END = 'LIVE_OPEN_PLATFORM_INTERACTION_END',
}

const textEncoder = new TextEncoder()

export function makePacket(rawBody: object | string, operation: OPERATION, version: VERSION = VERSION.ACTUAL) {
  const body = textEncoder.encode(isString(rawBody) ? rawBody : JSON.stringify(rawBody))
  const headerBuffer = new ArrayBuffer(HEADER_SIZE)
  const headerView = new DataView(headerBuffer)
  headerView.setUint32(0, HEADER_SIZE + body.byteLength)
  headerView.setUint16(4, HEADER_SIZE)
  headerView.setUint16(6, version)
  headerView.setUint32(8, operation)
  headerView.setUint32(12, 0)

  const header = new Uint8Array(headerBuffer)
  const packet = new Uint8Array(header.length + body.length)
  packet.set(header)
  packet.set(body, header.length)
  return packet
}

type Package = WS.SMSReplyPackage | WS.SMSReplyPackage | WS.AuthReplyPackage
export async function parseWsMessage(rawData: Blob): Promise<Package> {
  const buffer = await rawData.arrayBuffer()
  const view = new DataView(buffer)
  const bodyBuffer = buffer.slice(16)
  const version = view.getUint16(6) as VERSION
  const operation = view.getUint32(8)

  return {
    packetLength: view.getUint32(0),
    headerLength: view.getUint16(4),
    version,
    operation,
    sequenceId: view.getUint32(12) as 0,
    body: operation === OPERATION.OP_HEARTBEAT_REPLY ? undefined : parseWsMessageBody(bodyBuffer, version),
  }
}

const textDecoder = new TextDecoder()

export function parseWsMessageBody(body: ArrayBuffer, version: VERSION) {
  if (version === VERSION.ACTUAL) {
    return JSON.parse(textDecoder.decode(body))
  }
  if (version === VERSION.COMPRESSED) {
    let buffer = inflate(body).buffer
    const pkgs: Blob[] = []
    while (buffer.byteLength > 0) {
      const view = new DataView(buffer)
      const packetLength = view.getUint32(0)
      const pkg = buffer.slice(0, packetLength)
      buffer = buffer.slice(packetLength)
      pkgs.push(new Blob([pkg]))
    }
    return pkgs.map((pkg) => parseWsMessage(pkg))
  }
  throw new Error('未知的version值')
}
