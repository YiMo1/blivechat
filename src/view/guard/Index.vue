<template>
  <async-component />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, inject } from 'vue'
import { useMessageStore } from '@/store/index.ts'
import { GUARD_THEME, GUARD_LEVEL, CONFIG_INJECTION_KEY } from '@/tool/index.ts'

const store = useMessageStore()
const themeMap = {
  [GUARD_THEME.DEFAULT]: () => import('./theme/Default.vue'),
} as const
const { guardTheme: theme, isTest } = inject(CONFIG_INJECTION_KEY) || { isTest: true, guardTheme: GUARD_THEME.DEFAULT }
const AsyncComponent = defineAsyncComponent({
  loader: themeMap[theme],
})

onBeforeMount(() => {
  if (isTest) {
    const pushGuards = () => {
      store.guards.push({
        user_info: {
          uid: 0,
          open_id: '39b8fedb-60a5-4e29-ac75-b16955f7e632',
          uname: names[Math.floor(Math.random() * names.length)],
          uface: 'https://static.hdslb.com/images/member/noface.gif',
        },
        guard_level: levels[Math.floor(Math.random() * levels.length)],
        guard_num: 1,
        guard_unit: '月',
        price: 198000,
        fans_medal_level: 24,
        fans_medal_name: 'aw4ifC',
        fans_medal_wearing_status: false,
        timestamp: 1653555128,
        room_id: 460695,
        msg_id: (id++).toString(),
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
