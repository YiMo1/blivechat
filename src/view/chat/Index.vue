<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, onBeforeMount } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { CHAT_THEME, CONFIG_INJECTION_KEY, mockChat, mockGuard, mockGift } from '@/tool/index.ts'
import { useIntervalFn } from '@vueuse/core'

const store = useMessageStore()
const themeMap = {
  [CHAT_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const { chatTheme: theme, isTest } = inject(CONFIG_INJECTION_KEY) || { isTest: true, chatTheme: CHAT_THEME.DEFAULT }
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})

onBeforeMount(() => {
  if (isTest) {
    const mockFns = [mockChat, mockGuard, mockGift]
    const mockChats = () => {
      return mockFns[Math.floor(Math.random() * mockFns.length)]()
    }
    const { pause, resume } = useIntervalFn(() => {
      store.chats.push(mockChats())
    }, 1000 / 1)
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
