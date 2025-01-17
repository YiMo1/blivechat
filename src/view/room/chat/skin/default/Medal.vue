<template>
  <div ref="medal" class="ml-2 inline-flex rounded-sm border-2 border-solid border-[var(--color)] text-xs">
    <div class="bg-[var(--color)] px-1 text-white">{{ name }}</div>
    <div class="bg-white px-1 text-[var(--color)]">{{ level }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ level: number; name: string }>()
const medal = ref<HTMLDivElement>()

onMounted(() => {
  medal.value && medal.value.style.setProperty('--color', calculationMedalColor(props.level))
})

function calculationMedalColor(level: number) {
  if (level >= 35) return '#ff0000'
  if (level >= 30) return '#e54b4b'
  if (level >= 25) return '#ff8936'
  if (level >= 20) return '#f2be45'
  if (level >= 15) return '#8d4bbb'
  if (level >= 10) return '#2e4e7e'
  if (level >= 5) return '#0aa344'
  return '#75878a'
}
</script>
