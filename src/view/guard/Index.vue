<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, inject } from 'vue'
import { useIntervalFn } from '@vueuse/core'

import { useMessageStore } from '@/store/index.ts'
import { GUARD_SKIN, CONFIG_INJECTION_KEY, mockGuard } from '@/tool/index.ts'

const store = useMessageStore()
const skinMaping = {
  [GUARD_SKIN.DEFAULT]: () => import('./skin/Default.vue'),
} as const
const { guardSkin: skin, isTest } = inject(CONFIG_INJECTION_KEY) || { isTest: true, guardSkin: GUARD_SKIN.DEFAULT }
const AsyncComponent = defineAsyncComponent({
  loader: skinMaping[skin],
})

onBeforeMount(() => {
  if (isTest) {
    store.guards.push(mockGuard().data)
    const { pause, resume } = useIntervalFn(() => {
      store.guards.push(mockGuard().data)
    }, 1000 * 7)
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
