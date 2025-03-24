<script setup lang="ts">
import { StorageSerializers } from '@vueuse/core'

import { type Info, keepHeartbeat, startGame } from '@/api/index.ts'
import {
  CHAT_SKIN,
  CONFIG_INJECTION_KEY,
  DEFUALT_CHAT_RETAINED_QUANTITY,
  GUARD_SKIN,
  INFO_SESSION_STORAGE_KEY,
  LIVE_OPEN_PLATFORM_MSG,
  OPERATION,
  PROJECT_HEARBEAT_INTERVAL,
  WS_HEARBEAT_INTERVAL,
  emitter,
  includesByArray,
  isString,
  makePacket,
  mockChat,
  mockGift,
  mockGuard,
  mockSuperChat,
  parseWsMessage,
  randomByArray,
} from '@/tool/index.ts'

const urlSearchParams = new URLSearchParams(window.location.search)

const info = useSessionStorage<Info | null>(INFO_SESSION_STORAGE_KEY, null, {
  serializer: StorageSerializers.object,
})
const visibility = useDocumentVisibility()
const searchParams = readonly({
  test: urlSearchParams.get('test'),
  guardSkin: urlSearchParams.get('guardSkin'),
  chatSkin: urlSearchParams.get('chatSkin'),
  chatRetainedQuantity: urlSearchParams.get('chatRetainedQuantity'),
  code: urlSearchParams.get('code'),
})

provide(CONFIG_INJECTION_KEY, readonly(getConfig()))

function getConfig() {
  const guardSkin = includesByArray(
    Object.values(GUARD_SKIN),
    searchParams.guardSkin,
  )
    ? searchParams.guardSkin
    : GUARD_SKIN.DEFAULT

  const chatSkin = includesByArray(
    Object.values(CHAT_SKIN),
    searchParams.chatSkin,
  )
    ? searchParams.chatSkin
    : CHAT_SKIN.DEFAULT

  let chatRetainedQuantity = parseInt(urlSearchParams.get('chatRetainedQuantity') ?? '')
  if (Number.isNaN(chatRetainedQuantity) || chatRetainedQuantity < 1) {
    chatRetainedQuantity = DEFUALT_CHAT_RETAINED_QUANTITY
  }

  return {
    guardSkin,
    chatSkin,
    chatRetainedQuantity,
  }
}

onBeforeMount(async () => {
  if (searchParams.test === '1') {
    const mockFns = [mockChat, mockGift, mockSuperChat]

    const { pause: pauseMockGuard, resume: resumeMockGuard } = useIntervalFn(
      () => {
        const msg = mockGuard()
        emitter.emit(msg.cmd, msg)
        emitter.emit(LIVE_OPEN_PLATFORM_MSG, msg)
      },
      1000 * 7,
    )

    const { pause: pauseMockChats, resume: resumeMockChats } = useIntervalFn(
      () => {
        const msg = randomByArray(mockFns)()
        emitter.emit(msg.cmd, msg)
        emitter.emit(LIVE_OPEN_PLATFORM_MSG, msg)
      },
      1000 / 1,
    )

    function resume() {
      resumeMockChats()
      resumeMockGuard()
    }

    function pause() {
      pauseMockGuard()
      pauseMockChats()
    }

    watchEffect(() => {
      visibility.value === 'visible' ? resume() : pause()
    })
  } else if (searchParams.code) {
    const code = isString(searchParams.code)
      ? searchParams.code
      : searchParams.code[0]

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
      }
    }

    async function start() {
      const { data } = await startGame(code)
      if (data.code !== 0) {
        ElMessage.error(data.message)
        return
      }
      info.value = data.data
    }

    const { resume } = useIntervalFn(heartbeat, PROJECT_HEARBEAT_INTERVAL, {
      immediate: false,
    })

    !info.value ? await start() : heartbeat()
    resume()

    useWebSocket(info.value?.websocket_info.wss_link[0], {
      heartbeat: {
        interval: WS_HEARBEAT_INTERVAL,
        message: makePacket('', OPERATION.OP_HEARTBEAT),
      },
      onConnected(ws) {
        ws.send(makePacket(info.value!.websocket_info.auth_body, OPERATION.OP_AUTH))
      },
      async onMessage(_, event) {
        const data = await parseWsMessage(event.data as Blob)
        if (data.operation === OPERATION.OP_SEND_SMS_REPLY) {
          const message = data.body
          emitter.emit(LIVE_OPEN_PLATFORM_MSG, message)
          emitter.emit(message.cmd, message)
        }
      },
    })
  } else {
    ElMessage.error('加载失败: 缺少身份码或不是测试环境')
  }
})
</script>

<template>
  <router-view />
</template>
