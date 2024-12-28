<template>
  <div ref="container" class="container">
    <transition-group name="super_chat" tag="ul" class="super_chat_container">
      <template v-for="superChat in superChats.toReversed()" :key="superChat.msg_id">
        <li :class="['tag', calculationSuperChatColor(superChat.rmb)]" @click="() => expandSuperChat(superChat)">
          <div class="backgroud">
            <div
              class="progress"
              :style="{ 'animation-duration': `${(superChat.end_time - superChat.start_time) / 1000}s` }"
              @animationend="() => delSuperChat(superChat)"
            />
          </div>
          <img class="avatar" :src="superChat.uface" />
          <span>CN￥{{ superChat.rmb }}</span>
        </li>
      </template>
    </transition-group>
    <ul ref="chatContainer" class="chat_container">
      <transition-group name="chat">
        <template v-for="chat in chats" :key="chat.data.msg_id">
          <li v-if="chat.cmd === CMD.CHAT" class="chat">
            <img class="avatar" :src="chat.data.uface" />
            <div>
              <div class="name">
                <span>{{ chat.data.uname }}</span>
                <div
                  v-if="chat.data.fans_medal_wearing_status"
                  :class="['medal', calculationMedalColor(chat.data.fans_medal_level)]"
                >
                  <div class="medal_name">{{ chat.data.fans_medal_name }}</div>
                  <div class="medal_level">{{ chat.data.fans_medal_level }}</div>
                </div>
              </div>
              <emoji-text v-if="chat.data.dm_type === DM_TYPE.NORMAL" class="msg" :text="chat.data.msg" />
              <img v-else class="emoji" :src="chat.data.emoji_img_url" />
            </div>
          </li>
          <li v-else-if="chat.cmd === CMD.GUARD" :class="['guard', calculationGuardColor(chat.data.guard_level)]">
            <img class="avatar" :src="chat.data.user_info.uface" />
            <div>
              <div class="name">
                <span>{{ chat.data.user_info.uname }}</span>
                <div
                  v-if="chat.data.fans_medal_wearing_status"
                  :class="['medal', calculationMedalColor(chat.data.fans_medal_level)]"
                >
                  <div class="medal_name">{{ chat.data.fans_medal_name }}</div>
                  <div class="medal_level">{{ chat.data.fans_medal_level }}</div>
                </div>
              </div>
              <div class="msg">欢迎{{ chat.data.user_info.uname }}上舰</div>
            </div>
          </li>
          <li v-else-if="chat.cmd === CMD.GIFT" class="gift">
            <div class="info">
              <img class="avatar" :src="chat.data.uface" />
              <div>
                <div class="name">
                  <span>{{ chat.data.uname }}</span>
                  <div
                    v-if="chat.data.fans_medal_wearing_status"
                    :class="['medal', calculationMedalColor(chat.data.fans_medal_level)]"
                  >
                    <div class="medal_name">{{ chat.data.fans_medal_name }}</div>
                    <div class="medal_level">{{ chat.data.fans_medal_level }}</div>
                  </div>
                </div>
                <div class="price">CN￥{{ (chat.data.price / 1000).toFixed(1) }}</div>
              </div>
            </div>
            <div class="msg">投喂&ensp;{{ chat.data.gift_name }}×{{ chat.data.gift_num }}</div>
          </li>
          <li v-else-if="chat.cmd === CMD.SUPER_CHAT" :class="['super_chat', calculationSuperChatColor(chat.data.rmb)]">
            <div class="info">
              <img class="avatar" :src="chat.data.uface" />
              <div>
                <div class="name">
                  <span>{{ chat.data.uname }}</span>
                  <div
                    v-if="chat.data.fans_medal_wearing_status"
                    :class="['medal', calculationMedalColor(chat.data.fans_medal_level)]"
                  >
                    <div class="medal_name">{{ chat.data.fans_medal_name }}</div>
                    <div class="medal_level">{{ chat.data.fans_medal_level }}</div>
                  </div>
                </div>
                <div class="price">CN￥{{ chat.data.rmb.toFixed(1) }}</div>
              </div>
            </div>
            <emoji-text class="msg" :text="chat.data.message" />
          </li>
        </template>
      </transition-group>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, h, inject, watchEffect } from 'vue'
import { useEventListener, useTimeoutFn, useDocumentVisibility, useIntervalFn } from '@vueuse/core'

import {
  CMD,
  DM_TYPE,
  emptyArrowFunction,
  GUARD_LEVEL,
  emitter,
  mockChat,
  mockGuard,
  mockGift,
  mockSuperChat,
  CONFIG_INJECTION_KEY,
  DEFUALT_CHAT_RETAINED_QUANTITY,
} from '@/tool/index.ts'
import type { Guard, Chat, Gift, SuperChat } from '@/types/index.ts'

const chats = ref<(Guard | Chat | Gift | SuperChat)[]>([])
const superChats = ref<SuperChat['data'][]>([])
const chatContainer = ref<HTMLUListElement>()
const container = ref<HTMLDivElement>()
const visibility = useDocumentVisibility()
const isScroll = ref(false)
const mockFns = [mockChat, mockGuard, mockGift, mockSuperChat]
function mockChats() {
  return mockFns[Math.floor(Math.random() * mockFns.length)]()
}
const { pause, resume } = useIntervalFn(
  () => {
    const chat = mockChats()
    if (chat.cmd === CMD.SUPER_CHAT) {
      superChats.value.push(chat.data)
    }
    chats.value.push(chat)
  },
  1000 / 1,
  { immediate: false },
)
const { start, stop } = useTimeoutFn(
  () => {
    isScroll.value = false
  },
  350,
  { immediate: false },
)
const { isTest, chatRetainedQuantity } = inject(CONFIG_INJECTION_KEY) || {
  isTest: true,
  chatRetainedQuantity: DEFUALT_CHAT_RETAINED_QUANTITY,
}

if (isTest) {
  watchEffect(() => {
    visibility.value ? resume() : pause()
  })
}

emitter.on(CMD.CHAT, (chat) => {
  chats.value.push(chat)
})
emitter.on(CMD.GIFT, (gift) => {
  chats.value.push(gift)
})
emitter.on(CMD.SUPER_CHAT, (superChat) => {
  chats.value.push(superChat)
  superChats.value.push(superChat.data)
})
emitter.on(CMD.GUARD, (guard) => {
  chats.value.push(guard)
})

watch(
  () => chats.value.length,
  (value) => {
    if (value > chatRetainedQuantity) {
      chats.value = chats.value.slice(-chatRetainedQuantity)
    }
  },
)

useEventListener(chatContainer, 'wheel', () => {
  stop()
  isScroll.value = true
  const el = chatContainer.value
  if (el && Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 50) {
    start()
  }
})

function expandSuperChat(superChat: SuperChat['data']) {
  ElMessageBox({
    message: h(EmojiText, { text: superChat.message, class: 'el-message-box-msg' }),
    showConfirmButton: false,
    title: `${superChat.uname}的超级留言`,
    appendTo: container.value || document.body,
  }).catch(emptyArrowFunction)
}

function delSuperChat(superChat: SuperChat['data']) {
  superChats.value = superChats.value.filter((item) => item.msg_id !== superChat.msg_id)
}

function calculationSuperChatColor(rmb: number) {
  if (rmb < 50) return '_30'
  if (rmb < 100) return '_50'
  if (rmb < 500) return '_100'
  if (rmb < 1000) return '_500'
  if (rmb < 2000) return '_1000'
  return '_2000'
}

function calculationMedalColor(level: number) {
  if (level <= 5) return '_5'
  if (level <= 10) return '_10'
  if (level <= 15) return '_15'
  if (level <= 2) return '_20'
  if (level <= 25) return '_25'
  if (level <= 30) return '_30'
  if (level <= 35) return '_35'
  return '_40'
}

function calculationGuardColor(level: Exclude<GUARD_LEVEL, GUARD_LEVEL.NONE>) {
  if (level === GUARD_LEVEL.ADMIRAL) return 'admiral'
  if (level === GUARD_LEVEL.CAPTAIN) return 'captain'
  if (level === GUARD_LEVEL.GOVERNOR) return 'governor'
}

watch(
  () => chats.value[chats.value.length - 1],
  () => {
    if (chatContainer.value && !isScroll.value) {
      chatContainer.value.scrollTop = chatContainer.value?.scrollHeight
    }
  },
  { flush: 'post' },
)
</script>

<style lang="scss" scoped>
.container {
  margin: 0 20px;
  height: 100vh;
  font-size: 14px;
  position: relative;

  :deep(.el-message-box-msg) {
    display: flex;
    align-items: center;

    img {
      width: 18px;
      height: 18px;
    }
  }
}

.medal {
  display: inline-flex;
  margin-left: 8px;
  border-radius: 2px;
  border: 2px solid var(--color);
  font-size: 12px;
  line-height: 1.2;

  &._5 {
    --color: #75878a;
  }
  &._10 {
    --color: #0aa344;
  }
  &._15 {
    --color: #2e4e7e;
  }
  &._20 {
    --color: #8d4bbb;
  }
  &._25 {
    --color: #f2be45;
  }
  &._30 {
    --color: #ff8936;
  }
  &._35 {
    --color: #e54b4b;
  }
  &._40 {
    --color: #ff0000;
  }

  .medal_name {
    padding: 0 4px;
    color: #fff;
    background-color: var(--color);
  }

  .medal_level {
    padding: 0 4px;
    background-color: #fff;
    color: var(--color);
  }
}

.chat_container {
  width: 100%;
  bottom: 0;
  position: absolute;
  max-height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  .chat,
  .gift,
  .guard,
  .super_chat {
    width: 100%;
    margin-bottom: 12px;

    .name {
      display: flex;
      align-items: center;
    }
  }

  .chat {
    display: flex;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-right: 10px;
    }

    .name {
      color: #696969;
      margin-bottom: 8px;
    }

    .emoji {
      display: block;
      height: 50px;
    }

    .msg {
      color: #111;
      display: flex;
      align-items: center;

      :deep(img) {
        width: 18px;
        height: 18px;
      }
    }
  }

  .guard {
    display: flex;
    background-color: var(--color);
    padding: 8px 12px;
    height: 56px;
    border-radius: 4px;
    line-height: 1;

    &.captain {
      --color: #6eabdd;
    }
    &.admiral {
      --color: #9771db;
    }
    &.governor {
      --color: #db7070;
    }

    .avatar {
      height: 100%;
      border-radius: 50%;
      margin-right: 12px;
    }

    .name {
      color: #fff;
      height: 20px;
      margin-bottom: 6px;
    }

    .msg {
      color: #ffffffbb;
    }
  }

  .gift {
    border-radius: 4px;
    overflow: hidden;
    color: #fff;

    .info {
      background-color: #1565c0;
      padding: 8px 12px;
      height: 48px;
      display: flex;
      line-height: 1;
    }

    .avatar {
      height: 100%;
      margin-right: 12px;
      border-radius: 50%;
    }

    .name {
      margin-bottom: 6px;
    }

    .price {
      font-size: 12px;
    }

    .msg {
      background-color: #1e88e5;
      padding: 6px 8px;
    }
  }

  .super_chat {
    border-radius: 4px;
    overflow: hidden;

    &._30 {
      --info-color: #edf5ff;
      --msg-color: #2a60b2;
    }
    &._50 {
      --info-color: #dbfffd;
      --msg-color: #427d9e;
    }
    &._100 {
      --info-color: #fff1c5;
      --msg-color: #e2b52b;
    }
    &._500 {
      --info-color: #ffead2;
      --msg-color: #e09443;
    }
    &._1000 {
      --info-color: #ffe7e4;
      --msg-color: #e54d4d;
    }
    &._2000 {
      --info-color: #ffd8d8;
      --msg-color: #ab1a32;
    }

    .info {
      background-color: var(--info-color);
      padding: 8px 12px;
      height: 48px;
      display: flex;
      line-height: 1;
      color: #111111cc;
    }

    .avatar {
      height: 100%;
      margin-right: 12px;
      border-radius: 50%;
    }

    .name {
      margin-bottom: 6px;
    }

    .price {
      font-size: 12px;
      color: #333333bb;
    }

    .msg {
      background-color: var(--msg-color);
      padding: 6px 8px;
      color: #ffffffbb;
      display: flex;
      align-items: center;

      :deep(img) {
        width: 18px;
        height: 18px;
      }
    }
  }
}

.super_chat_container {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  z-index: 10;
  max-width: 100%;
  overflow-x: auto;
  text-wrap: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }

  $tag-height: 32px;
  $gap: 3px;
  .tag {
    height: $tag-height;
    border-radius: calc($tag-height / 2);
    min-width: 100px;
    color: #fff;
    display: inline-flex;
    align-items: center;
    padding-left: $gap;
    padding-right: 12px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-right: 8px;

    &._30 {
      --background-color: #2a60b2;
      --progress-color: #4781d8;
    }
    &._50 {
      --background-color: #427d9e;
      --progress-color: #6ea9cc;
    }
    &._100 {
      --background-color: #e2b325;
      --progress-color: #f5d559;
    }
    &._500 {
      --background-color: #e88c03;
      --progress-color: #ff9a00;
    }
    &._1000 {
      --background-color: #cb1b1b;
      --progress-color: #ed3030;
    }
    &._2000 {
      --background-color: #9e1a1a;
      --progress-color: #c4261d;
    }
  }

  .backgroud {
    position: absolute;
    inset: 0;
    background-color: var(--background-color);
    z-index: -1;
  }

  .progress {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: var(--progress-color);
    animation-name: progress;
    animation-timing-function: linear;
  }

  $avatar-height: $tag-height - $gap * 2;
  .avatar {
    width: $avatar-height;
    height: $avatar-height;
    border-radius: 50%;
    margin-right: 6px;
  }
}

@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

.super_chat-move,
.super_chat-enter-active,
.super_chat-leave-active {
  transition: all 0.3s ease;
}
.super_chat-enter-from {
  transform: translateX(-100%);
}
.super_chat-leave-to {
  opacity: 0;
  transform: translateY(-120%);
}
.super_chat-leave-active {
  position: absolute !important;
}

.chat-move,
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
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
