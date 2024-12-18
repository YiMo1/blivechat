<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, inject } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { GUARD_THEME, CONFIG_INJECTION_KEY, mockGuard } from '@/tool/index.ts'

const store = useMessageStore()
const themeMap = {
  [GUARD_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const { guardTheme: theme, isTest } = inject(CONFIG_INJECTION_KEY) || { isTest: true, guardTheme: GUARD_THEME.DEFAULT }
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})

onBeforeMount(() => {
  if (isTest) {
    store.guards.push(mockGuard().data)
    setInterval(() => {
      store.guards.push(mockGuard().data)
    }, 1000 * 7)
  }
})
</script>
