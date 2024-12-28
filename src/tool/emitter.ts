import mitt from 'mitt'

import {
  Chat,
  Gift,
  Guard,
  EnterRoom,
  Like,
  LiveEnd,
  LiveStart,
  SuperChat,
  SuperChatOffline,
  InteractionEnd,
  Message,
} from '../types/index.ts'

import { CMD, LIVE_OPEN_PLATFORM_MSG } from './contanst.ts'

type Events = {
  [CMD.CHAT]: Chat
  [CMD.ENTER_ROOM]: EnterRoom
  [CMD.GIFT]: Gift
  [CMD.GUARD]: Guard
  [CMD.INTERACTION_END]: InteractionEnd
  [CMD.LIKE]: Like
  [CMD.LIVE_END]: LiveEnd
  [CMD.LIVE_START]: LiveStart
  [CMD.SUPER_CHAT]: SuperChat
  [CMD.SUPER_CHAT_OFFLINE]: SuperChatOffline
  [LIVE_OPEN_PLATFORM_MSG]: Message
}

export const emitter = mitt<Events>()