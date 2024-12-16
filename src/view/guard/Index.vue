<template>
  <async-component
    v-if="computedGuards[0]"
    :key="computedGuards[0].data.msg_id"
    :guard="computedGuards[0]"
    @ended="() => computedGuards.shift()"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onBeforeMount, computed } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { GUARD_THEME, GUARD_LEVEL, CMD, getConfig } from '@/tool/index.ts'
import { useRoute } from 'vue-router'
import type { Guard } from '@/types/index.ts'

const store = useMessageStore()
const route = useRoute()
const themeMap = {
  [GUARD_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const { theme, isTest } = getConfig(route)
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})

const guards = ref<Guard[]>([])
const computedGuards = computed(() => (isTest ? guards.value : store.guards))

onBeforeMount(() => {
  if (isTest) {
    const pushGuards = () => {
      guards.value.push({
        cmd: CMD.GUARD,
        data: {
          user_info: {
            uid: 0, //用户UID(已废弃，固定为0)
            open_id: '39b8fedb-60a5-4e29-ac75-b16955f7e632', //用户唯一标识
            uname: names[Math.floor(Math.random() * names.length)], //用户昵称
            uface: 'https://static.hdslb.com/images/member/noface.gif', //用户头像
          },
          guard_level: levels[Math.floor(Math.random() * levels.length)], //对应的大航海等级 1总督 2提督 3舰长
          guard_num: 1,
          guard_unit: '月', // (正常单位为“月”，如为其他内容，无视`guard_num`以本字段内容为准，例如`*3天`)
          price: 198000,
          fans_medal_level: 24, //粉丝勋章等级
          fans_medal_name: 'aw4ifC', //粉丝勋章名
          fans_medal_wearing_status: false, //该房间粉丝勋章佩戴情况
          timestamp: 1653555128,
          room_id: 460695,
          msg_id: (id++).toString(), //消息唯一id
        },
      })
    }

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
    ] as const
    const levels = [GUARD_LEVEL.ADMIRAL, GUARD_LEVEL.CAPTAIN, GUARD_LEVEL.GOVERNOR] as const
    let id = 1
    pushGuards()
    setInterval(pushGuards, 1000 * 7)
  }
})
</script>
