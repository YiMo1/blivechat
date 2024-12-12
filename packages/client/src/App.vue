<template>
  <button @click="start">开始</button>
  <button @click="end">结束</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { startGame, keepHeartbeat, endGame, type Info } from './api/index.ts'

const code = ref('')
const info = ref<Info>()
const id = ref<number>()

async function start() {
  console.log('=========准备开始===========')
  const { data } = await startGame(code.value)
  if (data.code !== 0) {
    throw new Error(data.message)
  }
  console.log('=========成功开始===========')
  info.value = data.data
  id.value = window.setInterval(async () => {
    console.log('=========准备心跳===========')
    const { data } = await keepHeartbeat(info.value!.game_info.game_id)
    if (data.code !== 0) {
      throw new Error(data.message)
    }
    console.log('=========成功心跳===========')
  }, 1000 * 20)
}

async function end() {
  if (!info.value) return
  console.log('=========准备结束===========')
  const { data } = await endGame(info.value.game_info.game_id)
  if (data.code !== 0) {
    throw new Error(data.message)
  }
  clearInterval(id.value)
  console.log('=========成功结束===========')
}
</script>
