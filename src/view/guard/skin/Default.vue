<template>
  <div v-if="guard" id="guard-page" :key="guard.msg_id" @animationend.self="() => guards.shift()">
    <img id="full-screen-cele" :src="map[guard.guard_level]" />
    <img id="avatar" :guard-level="guard.guard_level" :src="guard.user_info.uface" />
    <div id="name" :guard-level="guard.guard_level">{{ guard.user_info.uname }}</div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn, useDocumentVisibility } from '@vueuse/core'
import { computed, ref, inject, watchEffect } from 'vue'

import { GUARD_LEVEL, emitter, CMD, CONFIG_INJECTION_KEY, mockGuard } from '@/tool/index.ts'

import type { Guard } from '@/types/index.ts'

const { isTest } = inject(CONFIG_INJECTION_KEY) || { isTest: true }

const guards = ref<Guard[]>([])
const visibility = useDocumentVisibility()
const { pause, resume } = useIntervalFn(() => {
  guards.value.push(mockGuard())
}, 1000 * 7)

emitter.on(CMD.GUARD, (guard) => {
  guards.value.push(guard)
})

const guard = computed(() => guards.value[0]?.data)

const map = {
  [GUARD_LEVEL.GOVERNOR]: 'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/default_captain_1_loop.webp',
  [GUARD_LEVEL.ADMIRAL]: 'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/default_captain_2_loop.webp',
  [GUARD_LEVEL.CAPTAIN]: 'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/captain_test_loop_2.webp',
}

if (isTest) {
  guards.value.push(mockGuard())
  watchEffect(() => {
    visibility.value ? resume() : pause()
  })
}
</script>

<style>
#guard-page {
  width: 1920px;
  height: 1080px;
  position: relative;
  animation: fadeOut 1s ease 3.7s forwards;
  user-select: none;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

#guard-page #full-screen-cele {
  position: absolute;
  inset: 0;
}

#guard-page #avatar {
  position: absolute;
  border-radius: 50%;
  top: 78%;
  left: 50%;
  height: 200px;
  width: 200px;
  transform: translate(-50%, -50%);
  border: solid 10px transparent;
  animation: fadeInUp 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) 1s forwards;
  opacity: 0;
  background: url('https://static.hdslb.com/images/member/noface.gif') no-repeat;
}

#guard-page #avatar[guard-level='1'] {
  border-color: #dc7171;
}

#guard-page #avatar[guard-level='2'] {
  border-color: #9671dc;
}

#guard-page #avatar[guard-level='3'] {
  border-color: #6fabdd;
}

#guard-page #name {
  position: absolute;
  left: 50%;
  top: 88%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 700;
  font-size: 28px;
  line-height: 1;
  padding: 10px 55px;
  border-radius: 35px;
  min-width: 220px;
  text-align: center;
  animation: fadeInUp 1s cubic-bezier(0.645, 0.045, 0.355, 1) 1.2s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate(-50%, 100px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

#guard-page #name[guard-level='1'] {
  background-color: #dc7171;
  box-shadow:
    0 0 0 6px #e4a1a1,
    0 0 0 12px #fff;
}

#guard-page #name[guard-level='2'] {
  background-color: #9671dc;
  box-shadow:
    0 0 0 6px #baa4e1,
    0 0 0 12px #fff;
}

#guard-page #name[guard-level='3'] {
  background-color: #6fabdd;
  box-shadow:
    0 0 0 6px #b4d2ea,
    0 0 0 12px #fff;
}
</style>
