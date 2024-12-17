import { CMD, DM_TYPE, GUARD_LEVEL } from './contanst.ts'
import type { Chat, Guard, Gift, SuperChat, Like } from '@/types/index.ts'

function random(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

let id = 0
const avatars = ['https://static.hdslb.com/images/member/noface.gif']
const names = [
  '御坂美琴',
  '食蜂操祈',
  '白井黑子',
  '北白川玉子',
  '宇智波佐助',
  '哆啦A梦',
  '蒙奇·D·路飞',
  '江户川柯南',
  '平泽唯',
  '灶门祢豆子',
  '西宫硝子',
  '凉宫春日',
  '椎名真白',
  '小鸟游六花',
  '雪之下雪乃',
  '宫园薰',
]
const guardLevels = [GUARD_LEVEL.ADMIRAL, GUARD_LEVEL.CAPTAIN, GUARD_LEVEL.GOVERNOR]
const allGuardLevels = [GUARD_LEVEL.ADMIRAL, GUARD_LEVEL.CAPTAIN, GUARD_LEVEL.GOVERNOR, GUARD_LEVEL.NONE]
function randomGuardLevel(all: boolean) {
  return random(all ? allGuardLevels : guardLevels)
}

function randomMedalLevel() {
  return Math.floor(Math.random() * 40) + 1
}

function randomPositiveInteger(max: number) {
  max = max < 1 ? 1 : parseInt(`${max}`)
  return Math.floor(Math.random() * max) + 1
}

const medalNames = ['衅颖', '拉雪', '牛智杰', '辉雨涵', '佴帅', '节志明', '茆斌', '国国辉', '慕熙瑶', '畅茗泽']
const emojis = [
  'http://i0.hdslb.com/bfs/emote/4cd1024d0c2ecee93224477946656d32c1705ccf.png',
  'http://i0.hdslb.com/bfs/emote/7a4cb0b644214d476ce198ddf6a7a0aa31311199.png',
  'http://i0.hdslb.com/bfs/emote/7407634bf67bfe9d7806f15d57608a1b18c2b4c2.png',
  'http://i0.hdslb.com/bfs/emote/8854f1b8a82126e3b87f3a1563da5feb55b23e71.png',
  'http://i0.hdslb.com/bfs/emote/d5a14055c8b4b457d7d815c79e7e4180299b375d.png',
  'http://i0.hdslb.com/bfs/emote/d03c1d062bb4f346c1041ca60bc763d404ddbd56.png',
  'http://i0.hdslb.com/bfs/emote/247cd9df8cdf84b18368c21e3b2dd374e84c0927.png',
  'http://i0.hdslb.com/bfs/emote/d7178e258a0efc969b65ccc2b1322fb235f5dff4.png',
]
const msgs = [
  '不要停下来啊',
  'yyds',
  '钱钱钱',
  '我忘不掉夏小姐了，如果不是知道了夏小姐，说不定我在这个世界没有留恋了',
  '二次元是不会背叛你的',
  '中嘞',
]

export function mockChat(): Chat {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.CHAT,
    data: {
      dm_type: r ? DM_TYPE.EMOJI : DM_TYPE.NORMAL,
      emoji_img_url: random(emojis),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: random(medalNames),
      guard_level: randomGuardLevel(true),
      fans_medal_wearing_status: !!r,
      uname: random(names),
      open_id: '',
      uid: 0,
      uface: random(avatars),
      room_id: 0,
      timestamp: 0,
      msg_id: (id++).toString(),
      msg: random(msgs),
    },
  }
}

export function mockGuard(): Guard {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.GUARD,
    data: {
      user_info: { open_id: '', uid: 0, uface: random(avatars), uname: random(names) },
      guard_num: 1,
      guard_unit: '月',
      price: randomPositiveInteger(1000000),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: random(medalNames),
      guard_level: randomGuardLevel(false),
      fans_medal_wearing_status: !!r,
      room_id: 0,
      timestamp: 0,
      msg_id: (id++).toString(),
    },
  }
}

const giftNames = ['冰激凌', '巧克力', '风暴节奏', '粉丝团灯牌', '跑车', '火箭', '飞机']
export function mockGift(): Gift {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.GIFT,
    data: {
      uid: 0,
      gift_name: random(giftNames),
      combo_info: { combo_base_num: 0, combo_id: '', combo_count: 0, combo_timeout: 0 },
      combo_gift: false,
      paid: !!r,
      uface: random(avatars),
      uname: random(names),
      price: randomPositiveInteger(100000),
      r_price: randomPositiveInteger(100000),
      anchor_info: { open_id: '', uid: 0, uface: random(avatars), uname: random(names) },
      open_id: '',
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: random(medalNames),
      fans_medal_wearing_status: !!r,
      guard_level: randomGuardLevel(false),
      room_id: 0,
      timestamp: 0,
      msg_id: (id++).toString(),
      gift_id: 0,
      gift_icon: '',
      gift_num: randomPositiveInteger(100),
    },
  }
}

export function mockSuperChat(): SuperChat {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.SUPER_CHAT,
    data: {
      room_id: 0,
      uid: 0,
      open_id: '',
      uname: random(names),
      uface: random(avatars),
      message_id: id++,
      message: random(msgs),
      rmb: randomPositiveInteger(5000),
      timestamp: 0,
      start_time: Date.now(),
      end_time: Date.now() + randomPositiveInteger(1000 * 600) + 1000 * 60,
      guard_level: randomGuardLevel(true),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: random(medalNames),
      fans_medal_wearing_status: !!r,
      msg_id: (id++).toString(),
    },
  }
}

export function mockLike(): Like {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.LIKE,
    data: {
      uname: random(names),
      uid: 0,
      open_id: '',
      uface: random(avatars),
      timestamp: 0,
      room_id: 0,
      like_text: '为主播点赞了',
      like_count: randomPositiveInteger(20),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: random(medalNames),
      fans_medal_wearing_status: !!r,
      msg_id: (id++).toString(),
    },
  }
}
