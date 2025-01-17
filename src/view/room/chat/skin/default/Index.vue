<template>
  <div ref="container" class="relative mx-5 min-h-[100vh] text-sm">
    <transition-group
      name="super_chat"
      tag="ul"
      class="absolute left-0 right-0 top-4 z-10 max-w-full overflow-x-auto text-nowrap scrollbar-hidden"
    >
      <super-chat-tag
        v-for="superChat in superChats"
        :key="superChat.msg_id"
        v-bind="superChat"
        @animationend="() => delSuperChat(superChat)"
      />
    </transition-group>
    <ul ref="chatContainer" class="absolute bottom-0 max-h-full w-full overflow-y-auto scrollbar-hidden">
      <transition-group name="chat">
        <template v-for="msg in messages" :key="msg.data.msg_id">
          <chat v-if="msg.cmd === CMD.CHAT" v-bind="msg.data" />
          <guard v-else-if="msg.cmd === CMD.GUARD" v-bind="msg.data" />
          <gift v-else-if="msg.cmd === CMD.GIFT" v-bind="msg.data" />
          <super-chat v-else-if="msg.cmd === CMD.SUPER_CHAT" v-bind="msg.data" />
        </template>
      </transition-group>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

import { useLimitArrayLength, useChatAutoScroll } from '@/hook/index.ts'
import { CMD, emitter, CONFIG_INJECTION_KEY, DEFUALT_CHAT_RETAINED_QUANTITY } from '@/tool/index.ts'

import Chat from './Chat.vue'
import Gift from './Gift.vue'
import Guard from './Guard.vue'
import SuperChat from './SuperChat.vue'
import SuperChatTag from './SuperChatTag.vue'

import type {
  Guard as GuardType,
  Chat as ChatType,
  Gift as GiftType,
  SuperChat as SuperChatType,
} from '@/types/index.ts'

const { chatRetainedQuantity } = inject(CONFIG_INJECTION_KEY) || {
  chatRetainedQuantity: DEFUALT_CHAT_RETAINED_QUANTITY,
}

const messages = ref<(GuardType | ChatType | GiftType | SuperChatType)[]>([])
const superChats = ref<SuperChatType['data'][]>([])
const chatContainer = ref<HTMLUListElement>()
const container = ref<HTMLDivElement>()

useLimitArrayLength(messages, { maxLength: chatRetainedQuantity, remove: 'head' })
useChatAutoScroll(messages, chatContainer)

emitter.on(CMD.CHAT, (chat) => {
  messages.value.push(chat)
})
emitter.on(CMD.GIFT, (gift) => {
  messages.value.push(gift)
})
emitter.on(CMD.SUPER_CHAT, (superChat) => {
  messages.value.push(superChat)
  superChats.value.unshift(superChat.data)
})
emitter.on(CMD.GUARD, (guard) => {
  messages.value.push(guard)
})

function delSuperChat(superChat: SuperChatType['data']) {
  superChats.value = superChats.value.filter((item) => item.msg_id !== superChat.msg_id)
}
</script>

<style scoped>
.super_chat-move,
.super_chat-enter-active,
.super_chat-leave-active {
  transition: all 0.35s ease;
}
.super_chat-enter-from {
  transform: translateX(-100%);
}
.super_chat-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.super_chat-leave-active {
  position: absolute;
}

.chat-move,
.chat-enter-active,
.chat-leave-active {
  transition: all 0.35s ease;
}
.chat-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.chat-leave-to {
  opacity: 0;
}
.chat-leave-active {
  position: absolute;
}
</style>
