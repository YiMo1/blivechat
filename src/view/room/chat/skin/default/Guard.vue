<template>
  <li ref="el" class="mb-3 flex h-14 w-full bg-[var(--color)] px-3 py-2">
    <img class="mr-3 h-full rounded-full" :src="guard.user_info.uface" />
    <div>
      <div class="mb-1.5 flex h-5 items-center">
        <span class="text-white">{{ guard.user_info.uname }}</span>
        <medal
          v-if="guard.fans_medal_wearing_status"
          :level="guard.fans_medal_level"
          :name="guard.fans_medal_name"
        />
      </div>
      <div class="text-[#ffffffbb]">欢迎{{ guard.user_info.uname }}上舰</div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { GUARD_LEVEL } from '@/tool/contanst.ts'

import Medal from './Medal.vue'

import type { Guard } from '@/types'

const props = defineProps<{ guard: Guard['data'] }>()
const el = ref<HTMLLIElement>()

onMounted(() => {
  el.value && el.value?.style.setProperty('--color', calculationColor(props.guard.guard_level))
})

function calculationColor(level: Exclude<GUARD_LEVEL, GUARD_LEVEL.NONE>) {
  if (level === GUARD_LEVEL.ADMIRAL) return '#9771db'
  if (level === GUARD_LEVEL.CAPTAIN) return '#6eabdd'
  if (level === GUARD_LEVEL.GOVERNOR) return '#db7070'
  return ''
}
</script>
