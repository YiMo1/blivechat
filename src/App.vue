<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMessageStore } from './store/index.ts'
import {
  INFO_SESSION_STORAGE_KEY,
  PROJECT_HEARBEAT_INTERVAL,
  WS_HEARBEAT_INTERVAL,
  makePacket,
  OPERATION,
  parseWsMessage,
  CMD,
  CONFIG_INJECTION_KEY,
  GUARD_THEME,
  CHAT_THEME,
  DEFUALT_CHAT_RETAINED_QUANTITY,
} from '@/tool/index.ts'
import { startGame, keepHeartbeat, type Info } from '@/api/index.ts'
import { useSessionStorage, StorageSerializers, useWebSocket, useIntervalFn } from '@vueuse/core'
import { onBeforeMount, provide } from 'vue'

const store = useMessageStore()
const info = useSessionStorage<Info | null>(INFO_SESSION_STORAGE_KEY, null, { serializer: StorageSerializers.object })
const config = getConfig()
provide(CONFIG_INJECTION_KEY, config)

function getConfig() {
  const search = new URLSearchParams(location.search)
  let guardTheme = search.get('guardTheme')
  if (!Array.prototype.includes.call(Object.values(GUARD_THEME), guardTheme)) {
    guardTheme = GUARD_THEME.DEFAULT
  }
  let chatTheme = search.get('chatTheme')
  if (!Array.prototype.includes.call(Object.values(CHAT_THEME), chatTheme)) {
    chatTheme = CHAT_THEME.DEFAULT
  }
  let chatRetainedQuantity = parseInt(search.get('chatRetainedQuantity') || '')
  if (Number.isNaN(chatRetainedQuantity) || chatRetainedQuantity < 1) {
    chatRetainedQuantity = DEFUALT_CHAT_RETAINED_QUANTITY
  }

  return {
    code: search.get('code'),
    isTest: Boolean(Number(search.get('test'))),
    guardTheme: guardTheme as GUARD_THEME,
    chatTheme: chatTheme as CHAT_THEME,
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
          store.all.push(message)
          switch (message.cmd) {
            case CMD.CHAT:
              store.chats.push(message)
              break
            case CMD.GIFT:
              store.gifts.push(message.data)
              store.chats.push(message)
              break
            case CMD.SUPER_CHAT:
              store.superChats.push(message.data)
              store.chats.push(message)
              break
            case CMD.LIKE:
              store.likes.push(message.data)
              store.chats.push(message)
              break
            case CMD.GUARD:
              store.guards.push(message.data)
              store.chats.push(message)
              break
          }
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
