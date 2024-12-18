<template>
  <div class="container">
    <transition-group name="super_chat" tag="ul" class="super_chat_container">
      <template v-for="superChat in superChats.toReversed()" :key="superChat.msg_id">
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
    <transition-group id="chat_container" name="chat" tag="ul" class="chat_container">
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { storeToRefs } from 'pinia'
import { CMD, DM_TYPE, emptyArrowFunction } from '@/tool/index.ts'

const { chats, superChats } = storeToRefs(useMessageStore())
const chatContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  chatContainer.value = document.querySelector<HTMLDivElement>('#chat_container')
})

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
    if (chatContainer.value) {
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
  font-size: 16px;
  position: relative;
}

.chat_container {
  width: 100%;
  bottom: 0;
  position: absolute;
  max-height: 100%;
  overflow-y: auto;
  padding-top: 150px;
  &::-webkit-scrollbar {
    display: none;
  }

  .chat,
  .gift,
  .guard,
  .super_chat {
    width: 100%;
    margin-bottom: 12px;
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

.super_chat_container {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  z-index: 10;
  max-width: 100%;
  overflow-x: auto;
  text-wrap: nowrap;
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
  transform: translateY(-150%);
}
.chat-leave-active {
  position: absolute;
}
</style>
