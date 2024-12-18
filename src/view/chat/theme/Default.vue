<template>
  <div ref="container" class="container">
    <transition-group name="chat" tag="ul">
      <template v-for="chat in chats" :key="chat.data.msg_id">
        <li v-if="chat.cmd === CMD.CHAT" class="chat">
          <img class="avatar" :src="chat.data.uface" />
          <div>
            <div class="name">
              <span>{{ chat.data.uname }}</span>
              <div v-if="chat.data.fans_medal_wearing_status" class="medal">
                <div class="medal_name">{{ chat.data.fans_medal_name }}</div>
                <div class="medal_level">{{ chat.data.fans_medal_level }}</div>
              </div>
            </div>
            <div>
              <span v-if="chat.data.dm_type === DM_TYPE.NORMAL" class="msg">{{ chat.data.msg }}</span>
              <img v-else class="emoji" :src="chat.data.emoji_img_url" />
            </div>
          </div>
        </li>
        <li v-else-if="chat.cmd === CMD.GUARD" class="guard">
          <img class="avatar" :src="chat.data.user_info.uface" />
          <div>
            <div class="name">
              <span>{{ chat.data.user_info.uname }}</span>
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
              </div>
              <div class="price">CN￥{{ (chat.data.price / 1000).toFixed(1) }}</div>
            </div>
          </div>
          <div class="msg">投喂&ensp;{{ chat.data.gift_name }}×{{ chat.data.gift_num }}</div>
        </li>
      </template>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { storeToRefs } from 'pinia'
import { CMD, DM_TYPE } from '@/tool/index.ts'

const { chats } = storeToRefs(useMessageStore())
const container = ref<HTMLDivElement>()

watch(
  () => chats.value[chats.value.length - 1],
  () => {
    if (container.value) {
      container.value.scrollTop = container.value?.scrollHeight
    }
  },
  { flush: 'post' },
)
</script>

<style scoped>
.container {
  --chat_gap: 16px;

  padding: 20px;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  font-size: 16px;
}
.container > ul {
  position: relative;
}
.container > ul > li {
  width: 100%;
  margin-bottom: var(--chat_gap);
}
/* 普通弹幕 */
.container .chat {
  display: flex;
}
.chat .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 10px;
}
.chat .name {
  color: #696969;
  margin-bottom: 6px;
}
.chat .emoji {
  height: 50px;
}
.chat .msg {
  color: #111;
}
.chat .medal {
  display: inline-flex;
  margin-left: 4px;
  border-radius: 4px;
  border: 2px solid red;
  font-size: 12px;
}
.chat .medal .medal_name {
  padding: 0 4px;
  color: #fff;
  background-color: red;
}
.chat .medal .medal_level {
  padding: 0 4px;
  background-color: #fff;
  color: red;
}
/* 上舰弹幕 */
.container .guard {
  display: flex;
  background-color: #0f9d58;
  padding: 6px 12px;
  height: 50px;
  border-radius: 4px;
}
.guard .avatar {
  height: 100%;
  border-radius: 50%;
  margin-right: 12px;
}
.guard .name {
  line-height: 1;
  color: #fff;
  margin-bottom: 6px;
}
.guard .msg {
  line-height: 1;
  color: #ffffffbb;
}
/* 礼物弹幕 */
.container .gift {
  border-radius: 4px;
  overflow: hidden;
  color: #fff;
}
.gift .info {
  background-color: #1565c0;
  padding: 6px 12px;
  height: 44px;
  display: flex;
  line-height: 1;
}
.gift .info .avatar {
  height: 100%;
  margin-right: 12px;
  border-radius: 50%;
}
.gift .info .name {
  font-size: 14px;
  margin-bottom: 8px;
}
.gift .info .price {
  font-size: 12px;
}
.gift .msg {
  background-color: #1e88e5;
  padding: 4px 8px;
  font-size: 14px;
}
/* 入场离场动画 */
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
  transform: translateY(-100%);
}
.chat-leave-active {
  position: absolute;
}
</style>
