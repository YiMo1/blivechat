<template>
  <div v-if="show" id="guard-page">
    <video id="full-screen-cele" muted autoplay :src="url" disablePictureInPicture @ended="() => $emit('ended')" />
    <img id="avatar" :guard-level="guard.level" :src="guard.uface" />
    <div id="name" :guard-level="guard.level">{{ guard.uname }}</div>
  </div>
</template>

<script setup lang="ts">
import { GUARD_LEVEL } from '@/tool/index.ts'
import type { Guard } from '../type.d.ts'
import { ref } from 'vue'

const props = defineProps<{ guard: Guard }>()
defineEmits<{ ended: [] }>()

const map = {
  [GUARD_LEVEL.GOVERNOR]: () => import('@/assets/总督.mp4'),
  [GUARD_LEVEL.ADMIRAL]: () => import('@/assets/提督.mp4'),
  [GUARD_LEVEL.CAPTAIN]: () => import('@/assets/舰长.mp4'),
} as const

const show = ref(false)
const url = ref<string>()

async function loadVideo() {
  url.value = (await map[props.guard.level]()).default
  const video = document.createElement('video')
  video.src = url.value
  video.addEventListener('canplay', () => {
    show.value = true
  })
}

loadVideo()
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
