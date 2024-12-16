import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Guard,
  Message,
  Chat,
  Gift,
  EnterRoom,
  Like,
  LiveEnd,
  LiveStart,
  SuperChat,
  SuperChatOffline,
  InteractionEnd,
} from '../types/index.d.ts'

export const useMessageStore = defineStore('message', () => {
  const guards = ref<Guard['data'][]>([])
  const chats = ref<Chat['data'][]>([])
  const gifts = ref<Gift['data'][]>([])
  const enterRooms = ref<EnterRoom['data'][]>([])
  const liveEnds = ref<LiveEnd['data'][]>([])
  const likes = ref<Like['data'][]>([])
  const liveStarts = ref<LiveStart['data'][]>([])
  const superChats = ref<SuperChat['data'][]>([])
  const superChatOfflines = ref<SuperChatOffline['data'][]>([])
  const interactionEnds = ref<InteractionEnd['data'][]>([])
  const all = ref<Message[]>([])

  return {
    guards,
    all,
    chats,
    gifts,
    likes,
    enterRooms,
    liveEnds,
    liveStarts,
    superChatOfflines,
    superChats,
    interactionEnds,
  }
})
