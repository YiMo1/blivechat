<script setup lang="ts">
import { CONFIG_INJECTION_KEY, GUARD_SKIN } from '@/tool/index.ts'

const skinMaping = {
  [GUARD_SKIN.DEFAULT]: () => import('./skin/Default.vue'),
} as const
const { guardSkin: skin } = inject(CONFIG_INJECTION_KEY) ?? {
  guardSkin: GUARD_SKIN.DEFAULT,
}
const AsyncComponent = defineAsyncComponent({
  loader: skinMaping[skin],
})
</script>

<template>
  <async-component />
</template>
