<template>
  <div class="container">
    <div class="super_chat_wrapper">
      <transition-group name="super_chat" tag="ul" class="super_chat_container">
        <template v-for="superChat in superChats" :key="superChat.msg_id">
          <li class="tag" @click="() => expandSuperChat(superChat)">
            <div class="backgroud">
              <div
                class="progress"
                :style="{ 'animation-duration': `${superChat.end_time - superChat.start_time}ms` }"
                @animationend="() => delSuperChat(superChat)"
              />
            </div>
            <img class="avatar" :src="superChat.uface" />
            <span>CN￥{{ superChat.rmb }}</span>
          </li>
        </template>
      </transition-group>
    </div>
    <div ref="chatWrapper" class="chat_wrapper">
      <transition-group name="chat" tag="ul" class="chat_container">
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
          <li v-else-if="chat.cmd === CMD.SUPER_CHAT" class="super_chat">
            <div class="info">
              <img class="avatar" :src="chat.data.uface" />
              <div>
                <div class="name">
                  <span>{{ chat.data.uname }}</span>
                </div>
                <div class="price">CN￥{{ chat.data.rmb.toFixed(1) }}</div>
              </div>
            </div>
            <div class="msg">{{ chat.data.message }}</div>
          </li>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { storeToRefs } from 'pinia'
import { CMD, DM_TYPE, emptyArrowFunction } from '@/tool/index.ts'

const { chats, superChats } = storeToRefs(useMessageStore())
const chatWrapper = ref<HTMLDivElement>()

type SuperChat = (typeof superChats.value)[number]

function expandSuperChat(superChat: SuperChat) {
  ElMessageBox({
    message: superChat.message,
    showConfirmButton: false,
    title: `${superChat.uname}的超级留言`,
  }).catch(emptyArrowFunction)
}

function delSuperChat(superChat: SuperChat) {
  superChats.value = superChats.value.filter((item) => item.msg_id !== superChat.msg_id)
}

watch(
  () => chats.value[chats.value.length - 1],
  () => {
    if (chatWrapper.value) {
      chatWrapper.value.scrollTop = chatWrapper.value?.scrollHeight
    }
  },
  { flush: 'post' },
)
</script>

<style lang="scss" scoped>
.container {
  margin: 0 20px;
  height: 100vh;
  font-size: 16px;
  position: relative;
}
.chat_wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
}

.chat_container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  position: relative;
  min-height: 100%;

  .chat,
  .gift,
  .guard,
  .super_chat {
    width: 100%;
    flex: 0 0 auto;
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
      margin-bottom: 6px;
    }

    .emoji {
      height: 50px;
    }

    .msg {
      color: #111;
    }

    .medal {
      display: inline-flex;
      margin-left: 4px;
      border-radius: 4px;
      border: 2px solid red;
      font-size: 12px;
    }

    .medal_name {
      padding: 0 4px;
      color: #fff;
      background-color: red;
    }

    .medal_level {
      padding: 0 4px;
      background-color: #fff;
      color: red;
    }
  }

  .guard {
    display: flex;
    background-color: #0f9d58;
    padding: 6px 12px;
    height: 50px;
    border-radius: 4px;

    .avatar {
      height: 100%;
      border-radius: 50%;
      margin-right: 12px;
    }

    .name {
      line-height: 1;
      color: #fff;
      margin-bottom: 6px;
    }

    .msg {
      line-height: 1;
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
      font-size: 14px;
      margin-bottom: 8px;
    }

    .price {
      font-size: 12px;
    }

    .msg {
      background-color: #1e88e5;
      padding: 6px 8px;
      font-size: 14px;
    }
  }

  .super_chat {
    border-radius: 4px;
    overflow: hidden;
    color: #fff;

    .info {
      background-color: #e65100;
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
      font-size: 14px;
      margin-bottom: 8px;
    }

    .price {
      font-size: 12px;
    }

    .msg {
      background-color: #f57c00;
      padding: 6px 8px;
      font-size: 14px;
    }
  }
}

.super_chat_wrapper {
  position: absolute;
  width: 100%;
  top: 15px;
  left: 0;
  right: 0;
  z-index: 10;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}

.super_chat_container {
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: row-reverse;
  justify-content: flex-end;
  font-size: 14px;
  &::-webkit-scrollbar {
    display: none;
  }

  .backgroud {
    position: absolute;
    inset: 0;
    background-color: #d00000;
    z-index: -1;
  }

  .progress {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #e62117;
    animation-name: progress;
    animation-timing-function: linear;
  }

  $tag-height: 32px;
  $gap: 3px;
  .tag {
    height: $tag-height;
    border-radius: $tag-height / 2;
    min-width: 100px;
    color: #fff;
    display: flex;
    align-items: center;
    padding-left: $gap;
    padding-right: 12px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    flex: 0 0 auto;
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
}
.super_chat-leave-active {
  position: absolute;
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
  transform: translateY(-100%);
}
.chat-leave-active {
  position: absolute;
}
</style>
