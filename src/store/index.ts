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
  const guards = ref<Guard[]>([])
  const chats = ref<Chat[]>([])
  const gifts = ref<Gift[]>([])
  const enterRooms = ref<EnterRoom[]>([])
  const liveEnds = ref<LiveEnd[]>([])
  const likes = ref<Like[]>([])
  const liveStarts = ref<LiveStart[]>([])
  const superChats = ref<SuperChat[]>([])
  const superChatOfflines = ref<SuperChatOffline[]>([])
  const interactionEnds = ref<InteractionEnd[]>([])
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
