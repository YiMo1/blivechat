<script setup lang="ts">
import { CMD, GUARD_LEVEL, emitter } from '@/tool/index.ts'

import type { Guard } from '@/types/index.ts'

const guards = ref<Guard['data'][]>([])
const first = computed<Guard['data'] | undefined>(() => guards.value[0])
const level = computed(() => {
  if (first.value?.guard_level === GUARD_LEVEL.GOVERNOR) return 1
  if (first.value?.guard_level === GUARD_LEVEL.ADMIRAL) return 2
  if (first.value?.guard_level === GUARD_LEVEL.CAPTAIN) return 3
  return undefined
})

emitter.on(CMD.GUARD, (guard) => {
  guards.value.push(guard.data)
})

const map = {
  [GUARD_LEVEL.GOVERNOR]:
    'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/default_captain_1_loop.webp',
  [GUARD_LEVEL.ADMIRAL]:
    'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/default_captain_2_loop.webp',
  [GUARD_LEVEL.CAPTAIN]:
    'https://i1.xuehusang.cn/openlivechat-css/fullScreenCele/captain_test_loop_2.webp',
}
</script>

<template>
  <div
    v-if="first"
    :key="first.msg_id"
    class="container-leave relative h-[1080px] w-[1920px] select-none"
    :data-level="level"
    @animationend.self="() => guards.shift()"
  >
    <img
      class="absolute inset-0"
      :src="map[first.guard_level]"
    />
    <img
      :class="[
        'avatar-enter absolute left-1/2 top-[78%] size-[200px] rounded-full',
        'border-[10px] border-solid border-[var(--border-color)] opacity-0',
      ]"
      :src="first.user_info.uface"
    />
    <div
      style="box-shadow: var(--box-shadow)"
      :class="[
        'name-enter absolute left-1/2 top-[88%] min-w-[220px] text-center text-[28px]',
        'rounded-full bg-[var(--bg-color)] px-[55px] py-2.5 leading-none text-white opacity-0',
      ]"
    >
      {{ first.user_info.uname }}
    </div>
  </div>
</template>

<style scoped>
.container-leave {
  animation: fadeOut 1s ease 3.7s forwards;
}

.avatar-enter {
  animation: fadeInUp 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) 1s forwards;
}

.name-enter {
  animation: fadeInUp 1s cubic-bezier(0.645, 0.045, 0.355, 1) 1.2s forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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

[data-level="1"] {
  --border-color: #dc7171;
  --bg-color: #dc7171;
  --box-shadow: 0 0 0 6px #e4a1a1, 0 0 0 12px #fff;
}
[data-level="2"] {
  --border-color: #9671dc;
  --bg-color: #9671dc;
  --box-shadow: 0 0 0 6px #baa4e1, 0 0 0 12px #fff;
}
[data-level="3"] {
  --border-color: #6fabdd;
  --bg-color: #6fabdd;
  --box-shadow: 0 0 0 6px #b4d2ea, 0 0 0 12px #fff;
}
</style>
