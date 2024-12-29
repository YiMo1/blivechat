import { CMD, DM_TYPE, GUARD_LEVEL } from './contanst.ts'

import type { Chat, Guard, Gift, SuperChat, Like } from '@/types/index.ts'

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
  '立华奏',
  '楪祈',
  '冰雪殇璃陌梦',
  '一之宫光',
  '希洛梦',
  '洛琪希',
  '犬夜叉',
  '江流儿',
  '散华礼弥',
  '蜡笔小新',
]
const guardLevels = [GUARD_LEVEL.ADMIRAL, GUARD_LEVEL.CAPTAIN, GUARD_LEVEL.GOVERNOR]
const allGuardLevels = [...guardLevels, GUARD_LEVEL.NONE]
const medalNames = [
  '宠鱼',
  '旧尘恋',
  '酸财鱼',
  '流酱',
  '易某',
  '傲娇云',
  '宝贝奈',
  '烤地苽',
  '真迪靓',
  '滴星子',
  '极温柔',
  '你的花',
  '好里谱',
  '小堡呗',
  '心愉悦',
  '鲨露露',
  '爱团叽',
  '护苏包',
]
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
  '我忘不掉夏小姐了，如果不是知道了夏小姐，说不定我在这个世界没有留恋了[花]',
  '二次元是不会背叛你的',
  '中嘞',
  '不要误会，我不是针对你，我是说在座各位都是垃圾。',
  '放了那个女孩。',
  '我读书少，你不要骗我。',
  '我全都要。',
  '做人没有梦想和咸鱼有什么分别。',
  '我话讲完，谁赞成？谁反对？',
  '嘴上全是主义，心里全是生意',
  '我从未见过如此厚颜无耻之人。',
  '二营长，你TN的意大利炮呢？',
  '你说的这个朋友到底是不是你自己。[dog]',
  '我问你这瓜保熟吗？[吃瓜]',
  '一切都是时臣的错',
  '教练，我想打篮球',
  '真好啊，这锻炼到刚好的白大腿，这腿我能玩一年，实在不错[亲亲]',
  '男人变态有什么错[滑稽]',
  '今天的风儿甚为喧嚣啊',
  '但是，我拒绝',
  '我秃了，也变强了',
  '我不做人了，JOJO！',
  '我是要成为海贼王的男人',
  '我喜欢你，比这地球上任何一个人都要喜欢！[比心]',
  '虎虎生威[虎年]',
  '祝各位朋友一夜暴富[金钱豹]',
  '三年之期已到，恭候龙王归为。[歪嘴笑]',
  '[瓜子]',
  '[赞][赞][赞]',
  '[牛][牛][牛]',
]
const giftNames = [
  '风暴节奏',
  '粉丝团灯牌',
  '小花花',
  'flag',
  '人气票',
  '这个好哎',
  '666',
  '纯白花嫁',
  '蔷薇恋语',
  '泰酷辣',
  '前方高能',
  '告白花束',
  '激素跑车',
  '萌兔火箭',
]
const SUPER_CHAT_SET_MEAL = [
  { rmb: 30, time: 1000 * 60 },
  { rmb: 50, time: 1000 * 60 * 2 },
  { rmb: 100, time: 1000 * 60 * 5 },
  { rmb: 500, time: 1000 * 60 * 30 },
  { rmb: 1000, time: 1000 * 60 * 60 },
  { rmb: 2000, time: 1000 * 60 * 60 * 2 },
]

function randomByArray<T extends any[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomGuardLevel<T extends boolean>(all: T) {
  return randomByArray(all ? allGuardLevels : guardLevels) as T extends true
    ? GUARD_LEVEL
    : Exclude<GUARD_LEVEL, GUARD_LEVEL.NONE>
}

function randomMedalLevel() {
  return Math.floor(Math.random() * 40) + 1
}

function randomNumber(options: { max?: number; min?: number; interger?: boolean } = {}) {
  const { min = 0, max = 1, interger = true } = options
  if (min > max) {
    throw new Error('最小值不能大于最大值')
  }
  const n = Math.random() * (max - min) + min
  return interger ? Math.round(n) : n
}

export function mockChat(): Chat {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.CHAT,
    data: {
      dm_type: r ? DM_TYPE.EMOJI : DM_TYPE.NORMAL,
      emoji_img_url: randomByArray(emojis),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: randomByArray(medalNames),
      guard_level: randomGuardLevel(true),
      fans_medal_wearing_status: !!r,
      uname: randomByArray(names),
      open_id: '',
      uid: 0,
      uface: randomByArray(avatars),
      room_id: 0,
      timestamp: Date.now(),
      msg_id: (id++).toString(),
      msg: randomByArray(msgs),
    },
  }
}

export function mockGuard(): Guard {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.GUARD,
    data: {
      user_info: { open_id: '', uid: 0, uface: randomByArray(avatars), uname: randomByArray(names) },
      guard_num: 1,
      guard_unit: '月',
      price: randomNumber({ max: 1000 * 20000, min: 1000 * 100 }),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: randomByArray(medalNames),
      guard_level: randomGuardLevel(false),
      fans_medal_wearing_status: !!r,
      room_id: 0,
      timestamp: Date.now(),
      msg_id: (id++).toString(),
    },
  }
}

export function mockGift(): Gift {
  const r = Math.round(Math.random())
  return {
    cmd: CMD.GIFT,
    data: {
      uid: 0,
      gift_name: randomByArray(giftNames),
      combo_info: { combo_base_num: 0, combo_id: '', combo_count: 0, combo_timeout: 0 },
      combo_gift: false,
      paid: !!r,
      uface: randomByArray(avatars),
      uname: randomByArray(names),
      price: randomNumber({ max: 1000 * 1000, min: 1000 * 0.1 }),
      r_price: randomNumber({ max: 1000 * 1000, min: 1000 * 0.1 }),
      anchor_info: { open_id: '', uid: 0, uface: randomByArray(avatars), uname: randomByArray(names) },
      open_id: '',
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: randomByArray(medalNames),
      fans_medal_wearing_status: !!r,
      guard_level: randomGuardLevel(false),
      room_id: 0,
      timestamp: Date.now(),
      msg_id: (id++).toString(),
      gift_id: 0,
      gift_icon: '',
      gift_num: randomNumber({ max: 100, min: 1 }),
    },
  }
}

export function mockSuperChat(): SuperChat {
  const i = randomByArray(SUPER_CHAT_SET_MEAL)
  const r = Math.round(Math.random())
  return {
    cmd: CMD.SUPER_CHAT,
    data: {
      room_id: 0,
      uid: 0,
      open_id: '',
      uname: randomByArray(names),
      uface: randomByArray(avatars),
      message_id: id++,
      message: randomByArray(msgs),
      rmb: i.rmb,
      timestamp: Date.now(),
      start_time: Date.now(),
      end_time: Date.now() + i.time,
      guard_level: randomGuardLevel(true),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: randomByArray(medalNames),
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
      uname: randomByArray(names),
      uid: 0,
      open_id: '',
      uface: randomByArray(avatars),
      timestamp: Date.now(),
      room_id: 0,
      like_text: '为主播点赞了',
      like_count: randomNumber({ max: 100, min: 1 }),
      fans_medal_level: randomMedalLevel(),
      fans_medal_name: randomByArray(medalNames),
      fans_medal_wearing_status: !!r,
      msg_id: (id++).toString(),
    },
  }
}
