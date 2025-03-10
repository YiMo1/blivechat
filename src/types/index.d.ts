import type {
  CMD,
  DM_TYPE,
  GUARD_LEVEL,
  OPERATION,
  VERSION,
} from '../tool/index.ts'

export type BasePackage = {
  headerLength: 16
  operation: OPERATION
  packetLength: number
  /** @deprecated */
  sequenceId: 0
  version: VERSION
}

export type AuthReplyPackage = {
  operation: OPERATION.OP_AUTH_REPLY
  body: { code: number }
} & BasePackage

export type HearbeatReplyPackage = {
  operation: OPERATION.OP_HEARTBEAT_REPLY
  body?: undefined
} & BasePackage

export type SMSReplyPackage = {
  operation: OPERATION.OP_SEND_SMS_REPLY
  body: Message
} & BasePackage

export type Package = AuthReplyPackage | HearbeatReplyPackage | SMSReplyPackage

export type Message =
  | Chat
  | Gift
  | SuperChat
  | Guard
  | Like
  | LiveStart
  | LiveEnd
  | EnterRoom
  | InteractionEnd
  | SuperChatOffline

export type Chat = {
  cmd: CMD.CHAT
  data: {
    room_id: number
    /** @deprecated */
    uid: 0
    open_id: string
    uname: string
    msg: string
    msg_id: string
    fans_medal_level: number
    fans_medal_name: string
    fans_medal_wearing_status: boolean
    guard_level: GUARD_LEVEL
    timestamp: number
    uface: string
    emoji_img_url: string
    dm_type: DM_TYPE
  }
}

type AnchorInfo = {
  uid: number
  open_id: string
  uname: string
  uface: string
}

type ComboInfo = {
  combo_base_num: number
  combo_count: number
  combo_id: string
  combo_timeout: number
}

export type Gift = {
  cmd: CMD.GIFT
  data: {
    room_id: number
    /** @deprecated */
    uid: 0
    open_id: string
    uname: string
    uface: string
    gift_id: number
    gift_name: string
    gift_num: number
    price: number
    r_price: number
    paid: boolean
    fans_medal_level: number
    fans_medal_name: string
    fans_medal_wearing_status: boolean
    guard_level: GUARD_LEVEL
    timestamp: number
    anchor_info: AnchorInfo
    msg_id: string
    gift_icon: string
    combo_gift: boolean
    combo_info: ComboInfo
  }
}

export type SuperChat = {
  cmd: CMD.SUPER_CHAT
  data: {
    room_id: number
    /** @deprecated */
    uid: 0
    open_id: string
    uname: string
    uface: string
    message_id: number
    message: string
    rmb: number
    timestamp: number
    start_time: number
    end_time: number
    guard_level: GUARD_LEVEL
    fans_medal_level: number
    fans_medal_name: string
    fans_medal_wearing_status: boolean
    msg_id: string
  }
}

export type SuperChatOffline = {
  cmd: CMD.SUPER_CHAT_OFFLINE
  data: {
    room_id: number
    message_ids: number[]
    msg_id: string
  }
}

type UserInfo = {
  uid: 0
  open_id: string
  uname: string
  uface: string
}

export type Guard = {
  cmd: CMD.GUARD
  data: {
    user_info: UserInfo
    guard_level: Exclude<GUARD_LEVEL, GUARD_LEVEL.NONE>
    guard_num: number
    guard_unit: string
    price: number
    fans_medal_level: number
    fans_medal_name: string
    fans_medal_wearing_status: boolean
    room_id: number
    msg_id: string
    timestamp: number
  }
}

export type Like = {
  cmd: CMD.LIKE
  data: {
    uname: string
    uid: 0
    open_id: string
    uface: string
    timestamp: number
    room_id: number
    like_text: string
    like_count: number
    fans_medal_wearing_status: boolean
    fans_medal_name: string
    fans_medal_level: number
    msg_id: string
  }
}

export type EnterRoom = {
  cmd: CMD.ENTER_ROOM
  data: {
    room_id: number
    uface: string
    uname: string
    open_id: string
    timestamp: number
  }
}

export type LiveStart = {
  cmd: CMD.LIVE_START
  data: {
    room_id: number
    open_id: string
    timestamp: number
    area_id: number
    title: string
  }
}

export type LiveEnd = {
  cmd: CMD.LIVE_END
  data: {
    room_id: number
    open_id: string
    timestamp: number
    area_id: number
    title: string
  }
}

export type InteractionEnd = {
  cmd: CMD.INTERACTION_END
  data: {
    game_id: string
    timestamp: number
  }
}

export {}
