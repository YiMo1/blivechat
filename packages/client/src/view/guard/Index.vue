<template>
  <async-component v-if="guards[0]" :key="guards[0].id" :guard="guards[0]" @ended="() => guards.shift()" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import {
  GUARD_THEME,
  GUARD_LEVEL,
  INFO_SESSION_STORAGE_KEY,
  PROJECT_HEARBEAT_INTERVAL,
  WS_HEARBEAT_INTERVAL,
  makePacket,
  OPERATION,
  parseWsMessage,
  CMD,
} from '@/tool/index.ts'
import { useRoute } from 'vue-router'
import { getConfig } from './tool.ts'
import type { Guard } from './type.d.ts'
import { startGame, keepHeartbeat, type Info } from '@/api/index.ts'
import { useSessionStorage, StorageSerializers, useWebSocket, useIntervalFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const route = useRoute()
const themeMap = {
  [GUARD_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const { theme, isTest, code } = getConfig(route)
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})

const guards = ref<Guard[]>([])

if (isTest) {
  const pushGuards = () => {
    guards.value.push({
      id: (id++).toString(),
      uname: names[Math.floor(Math.random() * names.length)],
      uface: 'https://static.hdslb.com/images/member/noface.gif',
      level: levels[Math.floor(Math.random() * levels.length)],
    })
  }
  const names = [
    '御坂美琴',
    '食蜂操祈',
    '白井黑子',
    '北白川玉子',
    '宇智波佐助',
    '哆啦A梦',
    '蒙奇·D·路飞',
    '江户川柯南',
    '平泽唯',
    '灶门祢豆子',
    '西宫硝子',
    '凉宫春日',
    '椎名真白',
    '小鸟游六花',
    '雪之下雪乃',
    '宫园薰',
  ] as const
  const levels = [GUARD_LEVEL.ADMIRAL, GUARD_LEVEL.CAPTAIN, GUARD_LEVEL.GOVERNOR] as const
  let id = 1
  pushGuards()
  setInterval(pushGuards, 1000 * 7)
} else if (code) {
  const info = useSessionStorage<Info | null>(INFO_SESSION_STORAGE_KEY, null, { serializer: StorageSerializers.object })

  const start = async () => {
    const { data } = await startGame(code)
    if (data.code !== 0) {
      ElMessage.error(data.message)
      return
    }
    info.value = data.data
    resumeHearbeat()
  }

  const heartbeat = async () => {
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

  useWebSocket(() => info.value?.websocket_info.wss_link[0], {
    heartbeat: { interval: WS_HEARBEAT_INTERVAL, message: makePacket('', OPERATION.OP_HEARTBEAT) },
    onConnected(ws) {
      ws.send(makePacket(info.value!.websocket_info.auth_body, OPERATION.OP_AUTH))
    },
    async onMessage(_, event) {
      const data = await parseWsMessage(event.data)
      if (data.operation === OPERATION.OP_SEND_SMS_REPLY && data.body.cmd === CMD.GUARD) {
        const guard = data.body.data
        guards.value.push({
          id: guard.msg_id,
          level: guard.guard_level,
          uface: guard.user_info.uface,
          uname: guard.user_info.uname,
        })
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
} else {
  ElMessage.error('加载失败: 缺少身份码或不是测试环境')
}
</script>
