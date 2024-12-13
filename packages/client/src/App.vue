<template>
  <button @click="start">开始</button>
  <button @click="end">结束</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  INFO_SESSION_STORAGE_KEY,
  PROJECT_HEARBEAT_INTERVAL,
  WS_HEARBEAT_INTERVAL,
  makePacket,
  OPERATION,
  parseWsMessage,
} from './tool/index.ts'
import { useSessionStorage, StorageSerializers, useWebSocket, useIntervalFn } from '@vueuse/core'
import { startGame, keepHeartbeat, endGame, type Info } from './api/index.ts'

const code = ref('')
const info = useSessionStorage<Info | null>(INFO_SESSION_STORAGE_KEY, null, { serializer: StorageSerializers.object })
const { pause: pauseHearbeat, resume: resumeHearbeat } = useIntervalFn(heartbeat, PROJECT_HEARBEAT_INTERVAL, {
  immediate: false,
})
const { close: closeWebsocket } = useWebSocket(() => info.value?.websocket_info.wss_link[0], {
  heartbeat: { interval: WS_HEARBEAT_INTERVAL, message: makePacket('', OPERATION.OP_HEARTBEAT) },
  immediate: false,
  onConnected(ws) {
    ws.send(makePacket(info.value!.websocket_info.auth_body, OPERATION.OP_AUTH))
  },
  async onMessage(_, event) {
    const data = await parseWsMessage(event.data)
    console.log(data)
  },
})

async function start() {
  const { data } = await startGame(code.value)
  if (data.code !== 0) {
    throw new Error(data.message)
  }
  info.value = data.data
  resumeHearbeat()
}

async function heartbeat() {
  if (!info.value) return
  const { data } = await keepHeartbeat(info.value.game_info.game_id)
  if (data.code !== 0) {
    throw new Error(data.message)
  }
}

async function end() {
  if (!info.value) return
  const { data } = await endGame(info.value.game_info.game_id)
  if (data.code !== 0) {
    throw new Error(data.message)
  }
  pauseHearbeat()
  closeWebsocket()
  info.value = null
}
</script>
