<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, onBeforeMount, watch } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import {
  CHAT_THEME,
  CONFIG_INJECTION_KEY,
  mockChat,
  mockGuard,
  mockGift,
  mockSuperChat,
  DEFUALT_CHAT_RETAINED_QUANTITY,
  CMD,
} from '@/tool/index.ts'
import { useIntervalFn } from '@vueuse/core'

const store = useMessageStore()
const themeMap = {
  [CHAT_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const {
  chatTheme: theme,
  isTest,
  chatRetainedQuantity,
} = inject(CONFIG_INJECTION_KEY) || {
  isTest: true,
  chatTheme: CHAT_THEME.DEFAULT,
  chatRetainedQuantity: DEFUALT_CHAT_RETAINED_QUANTITY,
}
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})
const mockFns = [mockChat, mockGuard, mockGift, mockSuperChat]
function mockChats() {
  return mockFns[Math.floor(Math.random() * mockFns.length)]()
}
const { pause, resume } = useIntervalFn(
  () => {
    const chat = mockChats()
    if (chat.cmd === CMD.SUPER_CHAT) {
      store.superChats.push(chat.data)
    }
    store.chats.push(chat)
  },
  1000 / 1,
  { immediate: false },
)

watch(
  () => store.chats.length,
  (length) => {
    if (length > chatRetainedQuantity) {
      store.chats = store.chats.slice(-chatRetainedQuantity)
    }
  },
)

onBeforeMount(() => {
  if (isTest) {
    resume()
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resume()
      } else if (document.visibilityState === 'hidden') {
        pause()
      }
    })
  }
})
</script>
