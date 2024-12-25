import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Guard, Message, Chat, Gift, Like, SuperChat } from '../types/index.d.ts'

export type Chats = Guard | Chat | Gift | Like | SuperChat

export const useMessageStore = defineStore('message', () => {
  const guards = ref<Guard['data'][]>([])
  const chats = ref<Chats[]>([])
  const gifts = ref<Gift['data'][]>([])
  const likes = ref<Like['data'][]>([])
  const superChats = ref<SuperChat['data'][]>([])
  const all = ref<Message[]>([])

  return {
    guards,
    all,
    chats,
    gifts,
    likes,
    superChats,
  }
})
