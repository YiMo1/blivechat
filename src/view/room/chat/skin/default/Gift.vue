<template>
  <li class="mb-3 w-full overflow-hidden rounded text-white">
    <div class="flex items-center bg-[#1565c0] px-3 py-2">
      <img class="mr-3 h-10 rounded-full" :src="uface" />
      <div class="flex-1">
        <div class="mb-1 flex items-center">
          <span>{{ uname }}</span>
          <medal v-if="fans_medal_wearing_status" :level="fans_medal_level" :name="fans_medal_name" />
        </div>
        <div class="text-xs">CN￥{{ (price / 1000).toFixed(1) }}</div>
      </div>
    </div>
    <div class="bg-[#1e88e5] px-2 py-1.5">投喂&ensp;{{ gift_name }}×{{ gift_num }}</div>
  </li>
</template>

<script setup lang="ts">
import Medal from './Medal.vue'

import type { Gift } from '@/types/index.ts'

defineProps<Gift['data']>()
</script>
