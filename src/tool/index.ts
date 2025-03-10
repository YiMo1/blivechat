import { inflate } from 'pako'

import { HEADER_SIZE, OPERATION, VERSION } from './contanst.ts'
import { isString } from './general.ts'

import type { Package } from '../types/index.d.ts'

export * from './general.ts'
export * from './contanst.ts'
export * from './mock.ts'
export * from './emitter.ts'

const textEncoder = new TextEncoder()

export function makePacket(
  rawBody: object | string,
  operation: OPERATION,
  version: VERSION = VERSION.ACTUAL,
) {
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
  return packet.buffer
}

export async function parseWsMessage(rawData: Blob): Promise<Package> {
  const buffer = await rawData.arrayBuffer()
  const view = new DataView(buffer)
  const bodyBuffer = buffer.slice(16)
  const version = view.getUint16(6) as VERSION
  const operation = view.getUint32(8)

  return {
    packetLength: view.getUint32(0),
    headerLength: view.getUint16(4) as 16,
    version,
    operation,
    sequenceId: view.getUint32(12) as 0,
    // eslint-disable-next-line ts/no-unsafe-assignment
    body:
      operation === OPERATION.OP_HEARTBEAT_REPLY
        ? undefined
        : parseWsMessageBody(bodyBuffer, version),
  }
}

const textDecoder = new TextDecoder()

export function parseWsMessageBody(body: ArrayBuffer, version: VERSION) {
  switch (version) {
    case VERSION.ACTUAL:
      // eslint-disable-next-line ts/no-unsafe-return
      return JSON.parse(textDecoder.decode(body))
    case VERSION.COMPRESSED: {

      let buffer = arrayBufferLikeToArrayBuffer(inflate(body).buffer)
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
  }
}

export function arrayBufferLikeToArrayBuffer(arrayBufferLike: ArrayBufferLike) {
  const { byteLength } = arrayBufferLike
  const targetBuffer = new ArrayBuffer(byteLength)
  const targetView = new Uint8Array(targetBuffer)
  const sourceView = new Uint8Array(arrayBufferLike)
  targetView.set(sourceView)
  return targetBuffer
}
