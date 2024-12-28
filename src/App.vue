<template>
  <router-view />
</template>

<script setup lang="ts">
import { useSessionStorage, StorageSerializers, useWebSocket, useIntervalFn } from '@vueuse/core'
import { onBeforeMount, provide } from 'vue'

import { startGame, keepHeartbeat, type Info } from '@/api/index.ts'
import {
  INFO_SESSION_STORAGE_KEY,
  PROJECT_HEARBEAT_INTERVAL,
  WS_HEARBEAT_INTERVAL,
  makePacket,
  OPERATION,
  parseWsMessage,
  CONFIG_INJECTION_KEY,
  GUARD_SKIN,
  CHAT_SKIN,
  DEFUALT_CHAT_RETAINED_QUANTITY,
  emitter,
  LIVE_OPEN_PLATFORM_MSG,
} from '@/tool/index.ts'

const info = useSessionStorage<Info | null>(INFO_SESSION_STORAGE_KEY, null, { serializer: StorageSerializers.object })
const config = getConfig()
provide(CONFIG_INJECTION_KEY, config)

function getConfig() {
  const search = new URLSearchParams(location.search)
  let guardSkin = search.get('guardSkin')
  if (!Array.prototype.includes.call(Object.values(GUARD_SKIN), guardSkin)) {
    guardSkin = GUARD_SKIN.DEFAULT
  }
  let chatSkin = search.get('chatSkin')
  if (!Array.prototype.includes.call(Object.values(CHAT_SKIN), chatSkin)) {
    chatSkin = CHAT_SKIN.DEFAULT
  }
  let chatRetainedQuantity = parseInt(search.get('chatRetainedQuantity') || '')
  if (Number.isNaN(chatRetainedQuantity) || chatRetainedQuantity < 1) {
    chatRetainedQuantity = DEFUALT_CHAT_RETAINED_QUANTITY
  }

  return {
    code: search.get('code'),
    isTest: Boolean(Number(search.get('test'))),
    guardSkin: guardSkin as GUARD_SKIN,
    chatSkin: chatSkin as CHAT_SKIN,
    chatRetainedQuantity,
  }
}

async function start() {
  if (!config.code) return
  const { data } = await startGame(config.code)
  if (data.code !== 0) {
    ElMessage.error(data.message)
    return
  }
  info.value = data.data
  resumeHearbeat()
}

async function heartbeat() {
  if (!info.value) return
  const { data } = await keepHeartbeat(info.value.game_info.game_id)
  if (data.code !== 0) {
    ElMessage.error(data.message)
    switch (data.code) {
      case 7003:
        info.value = null
        start()
    }
    return
  }
}

const { resume: resumeHearbeat } = useIntervalFn(heartbeat, PROJECT_HEARBEAT_INTERVAL, {
  immediate: false,
})

onBeforeMount(() => {
  if (!config.isTest) {
    if (!config.code) {
      ElMessage.error('加载失败: 缺少身份码或不是测试环境')
      return
    }
    useWebSocket(() => info.value?.websocket_info.wss_link[0], {
      heartbeat: { interval: WS_HEARBEAT_INTERVAL, message: makePacket('', OPERATION.OP_HEARTBEAT) },
      onConnected(ws) {
        ws.send(makePacket(info.value!.websocket_info.auth_body, OPERATION.OP_AUTH))
      },
      async onMessage(_, event) {
        const data = await parseWsMessage(event.data)
        if (data.operation === OPERATION.OP_SEND_SMS_REPLY) {
          const message = data.body
          emitter.emit(LIVE_OPEN_PLATFORM_MSG, message)
          emitter.emit(message.cmd, message)
          return
        }
      },
    })

    if (!info.value) {
      start()
    } else {
      heartbeat()
      resumeHearbeat()
    }
  }
})
</script>
