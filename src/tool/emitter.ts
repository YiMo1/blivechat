import mitt from 'mitt'

import type { CMD, LIVE_OPEN_PLATFORM_MSG } from './contanst.ts'
import type {
  Chat,
  EnterRoom,
  Gift,
  Guard,
  InteractionEnd,
  Like,
  LiveEnd,
  LiveStart,
  Message,
  SuperChat,
  SuperChatOffline,
} from '../types/index.ts'

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
