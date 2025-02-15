<template>
  <li class="mb-3 flex w-full">
    <img class="mr-2.5 size-7 rounded-full" :src="chat.uface" />
    <div class="flex-1">
      <div class="mb-2 flex items-center">
        <span class="text-[#696969]">{{ chat.uname }}</span>
        <medal
          v-if="chat.fans_medal_wearing_status"
          :level="chat.fans_medal_level"
          :name="chat.fans_medal_name"
        />
      </div>
      <emoji-text
        v-if="chat.dm_type === DM_TYPE.NORMAL"
        class="flex items-center text-[#111]"
        :text="chat.msg"
      />
      <img v-else class="block h-12" :src="chat.emoji_img_url" />
    </div>
  </li>
</template>

<script setup lang="ts">
import { EmojiText } from '@/component/index.ts'
import { DM_TYPE } from '@/tool/index.ts'

import Medal from './Medal.vue'

import type { Chat } from '@/types'

defineProps<{ chat: Chat['data'] }>()
</script>
