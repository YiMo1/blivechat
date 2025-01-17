<template>
  <li
    ref="tag"
    class="relative mr-2 inline-flex min-w-[100px] cursor-pointer items-center overflow-hidden rounded-full p-1 pr-3 text-white"
    @click="() => expandSuperChat({ uname, message })"
  >
    <div class="absolute inset-0 -z-10 bg-[var(--background-color)]">
      <div
        class="progress absolute h-full w-full origin-left bg-[var(--progress-color)]"
        @animationend="() => $emit('animationend')"
      />
    </div>
    <img class="mr-2 h-7 w-7 rounded-full" :src="uface" />
    <span>CN￥{{ rmb }}</span>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'

import { EmojiText } from '@/component/index.ts'
import { noop } from '@/tool/index.ts'

import type { SuperChat } from '@/types/index.ts'

const props = defineProps<SuperChat['data']>()
defineEmits<{ animationend: [] }>()

const tag = ref<HTMLLIElement>()

onMounted(() => {
  if (tag.value) {
    const { progressColor, backgroundColor } = calculationColor(props.rmb)
    tag.value.style.setProperty('--progress-color', progressColor)
    tag.value.style.setProperty('--background-color', backgroundColor)
    tag.value.style.setProperty('--animate-duration', `${(props.end_time - props.start_time) / 1000}s`)
  }
})

function expandSuperChat({ message, uname }: { message: string; uname: string }) {
  ElMessageBox({
    message: h(EmojiText, { text: message }),
    showConfirmButton: false,
    title: `${uname}的超级留言`,
  }).catch(noop)
}

function calculationColor(rmb: number) {
  if (rmb >= 2000) return { backgroundColor: '#9e1a1a', progressColor: '#c4261d' }
  if (rmb >= 1000) return { backgroundColor: '#cb1b1b', progressColor: '#ed3030' }
  if (rmb >= 500) return { backgroundColor: '#e88c03', progressColor: '#ff9a00' }
  if (rmb >= 100) return { backgroundColor: '#e2b325', progressColor: '#f5d559' }
  if (rmb >= 50) return { backgroundColor: '#427d9e', progressColor: '#6ea9cc' }
  return { backgroundColor: '#2a60b2', progressColor: '#4781d8' }
}
</script>

<style scoped>
.progress {
  animation: progress var(--animate-duration) linear;
}

@keyframes progress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}
</style>
