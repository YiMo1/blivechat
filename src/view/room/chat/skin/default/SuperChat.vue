<script setup lang="ts">
import { EmojiText } from '@/component/index.ts'
import Medal from './Medal.vue'

import type { SuperChat } from '@/types'

const props = defineProps<{ superChat: SuperChat['data'] }>()
const el = ref<HTMLLIElement>()

onMounted(() => {
  if (el.value) {
    const { bgColor, msgColor } = calculationColor(props.superChat.rmb)
    el.value.style.setProperty('--bg-color', bgColor)
    el.value.style.setProperty('--msg-color', msgColor)
  }
})

function calculationColor(rmb: number) {
  if (rmb >= 2000) return { bgColor: '#ffd8d8', msgColor: '#ab1a32' }
  if (rmb >= 1000) return { bgColor: '#ffe7e4', msgColor: '#e54d4d' }
  if (rmb >= 500) return { bgColor: '#ffead2', msgColor: '#e09443' }
  if (rmb >= 100) return { bgColor: '#fff1c5', msgColor: '#e2b52b' }
  if (rmb >= 50) return { bgColor: '#dbfffd', msgColor: '#427d9e' }
  return { bgColor: '#edf5ff', msgColor: '#2a60b2' }
}
</script>

<template>
  <li
    ref="el"
    class="mb-3 w-full overflow-hidden rounded"
  >
    <div class="flex bg-[var(--bg-color)] px-3 py-2 text-[#111111cc]">
      <img class="mr-3 h-8 rounded-full" :src="superChat.uface" />
      <div>
        <div class="mb-1 flex items-center">
          <span>{{ superChat.uname }}</span>
          <medal
            v-if="superChat.fans_medal_wearing_status"
            :level="superChat.fans_medal_level"
            :name="superChat.fans_medal_name" />
        </div>
        <div class="text-xs text-[#333333bb]">
          CN￥{{ superChat.rmb.toFixed(1) }}
        </div>
      </div>
    </div>
    <emoji-text
      class="flex bg-[var(--msg-color)] px-2 py-1.5 text-[#ffffffbb]"
      :text="superChat.message" />
  </li>
</template>
