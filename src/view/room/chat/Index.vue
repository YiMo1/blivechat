<script setup lang="ts">
import { CHAT_SKIN, CONFIG_INJECTION_KEY } from '@/tool/index.ts'

const skinMaping = {
  [CHAT_SKIN.DEFAULT]: () => import('./skin/default/Index.vue'),
} as const
const { chatSkin: skin } = inject(CONFIG_INJECTION_KEY) ?? {
  chatSkin: CHAT_SKIN.DEFAULT,
}
const AsyncComponent = defineAsyncComponent({
  loader: skinMaping[skin],
})
</script>

<template>
  <async-component />
</template>
