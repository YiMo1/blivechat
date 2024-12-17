import type { InjectionKey } from 'vue'

export const INFO_SESSION_STORAGE_KEY = 'BLIVECHAT_INFO'
export const PROJECT_HEARBEAT_INTERVAL = 1000 * 20
export const WS_HEARBEAT_INTERVAL = 1000 * 30
export const HEADER_SIZE = 16
export const CONFIG_INJECTION_KEY: InjectionKey<{
  isTest: boolean
  code: string | null
  guardTheme: GUARD_THEME
}> = Symbol()

export enum OPERATION {
  OP_HEARTBEAT = 2,
  OP_HEARTBEAT_REPLY = 3,
  OP_SEND_SMS_REPLY = 5,
  OP_AUTH = 7,
  OP_AUTH_REPLY = 8,
}

export enum VERSION {
  ACTUAL = 0,
  COMPRESSED = 2,
}

export enum GUARD_LEVEL {
  NONE = 0,
  GOVERNOR = 1,
  ADMIRAL = 2,
  CAPTAIN = 3,
}

export enum DM_TYPE {
  NORMAL = 0,
  EMOJI = 1,
}

export enum CMD {
  CHAT = 'LIVE_OPEN_PLATFORM_DM',
  GIFT = 'LIVE_OPEN_PLATFORM_SEND_GIFT',
  SUPER_CHAT = 'LIVE_OPEN_PLATFORM_SUPER_CHAT',
  SUPER_CHAT_OFFLINE = 'LIVE_OPEN_PLATFORM_SUPER_CHAT_DEL',
  GUARD = 'LIVE_OPEN_PLATFORM_GUARD',
  LIKE = 'LIVE_OPEN_PLATFORM_LIKE',
  ENTER_ROOM = 'LIVE_OPEN_PLATFORM_LIVE_ROOM_ENTER',
  LIVE_START = 'LIVE_OPEN_PLATFORM_LIVE_START',
  LIVE_END = 'LIVE_OPEN_PLATFORM_LIVE_END',
  INTERACTION_END = 'LIVE_OPEN_PLATFORM_INTERACTION_END',
}

export enum GUARD_THEME {
  DEFAULT = 'default',
}