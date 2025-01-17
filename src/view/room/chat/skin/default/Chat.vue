<template>
  <li class="mb-3 flex w-full">
    <img class="mr-2.5 h-7 w-7 rounded-full" :src="uface" />
    <div class="flex-1">
      <div class="mb-2 flex items-center">
        <span class="text-[#696969]">{{ uname }}</span>
        <medal v-if="fans_medal_wearing_status" :level="fans_medal_level" :name="fans_medal_name" />
      </div>
      <emoji-text v-if="dm_type === DM_TYPE.NORMAL" class="flex items-center text-[#111]" :text="msg" />
      <img v-else class="block h-12" :src="emoji_img_url" />
    </div>
  </li>
</template>

<script setup lang="ts">
import { EmojiText } from '@/component/index.ts'
import { DM_TYPE } from '@/tool/index.ts'

import Medal from './Medal.vue'

import type { Chat } from '@/types/index.ts'

defineProps<Chat['data']>()
</script>
