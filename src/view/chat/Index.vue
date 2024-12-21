<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, onBeforeMount, watch } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import {
  CHAT_SKIN,
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
const skinMaping = {
  [CHAT_SKIN.DEFAULT]: () => import('./skin/Default.vue'),
} as const
const {
  chatSkin: skin,
  isTest,
  chatRetainedQuantity,
} = inject(CONFIG_INJECTION_KEY) || {
  isTest: true,
  chatSkin: CHAT_SKIN.DEFAULT,
  chatRetainedQuantity: DEFUALT_CHAT_RETAINED_QUANTITY,
}
const AsyncComponent = defineAsyncComponent({
  loader: skinMaping[skin],
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
