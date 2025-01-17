import { useEventListener, useTimeoutFn } from '@vueuse/core'
import { ref, watch, type MaybeRefOrGetter, toRef } from 'vue'

import { isNumber } from '@/tool/index.ts'

export interface UseChatAutoScrollOptions {
  /**
   * 滑动滚轮使容器滚动到离底部多少像素范围内才会开始切换至自动滚动
   * 如果为`false`则永远不切换至自动滚动
   * 如果为`true`则只要滚轮事件停止就立即计时
   * @default 50
   */
  offset?: number | boolean
  /**
   * 切换至自动模式的间隔时间
   * @default 350
   */
  interval?: number
  /**
   * 能否滑动滚轮使其暂时停止自动滚动
   * @default true
   */
  wheel?: boolean
}

export function useChatAutoScroll(
  chats: MaybeRefOrGetter<unknown[]>,
  container: MaybeRefOrGetter<HTMLElement | undefined | null>,
  options: UseChatAutoScrollOptions = {},
) {
  const { offset = 100, interval = 350, wheel = true } = options
  const isAutoScroll = ref(true)
  const containerRef = toRef(container)
  const chatsRef = toRef(chats)
  const { start: startAutoScroll, stop: stopAutoScroll } = useTimeoutFn(
    () => {
      isAutoScroll.value = true
    },
    interval,
    { immediate: false },
  )
  if (wheel) {
    useEventListener(container, 'wheel', () => {
      const el = containerRef.value
      stopAutoScroll()
      isAutoScroll.value = false
      if (isNumber(offset)) {
        if (el && Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < offset) {
          startAutoScroll()
        }
      } else if (offset) {
        startAutoScroll()
      }
    })
  }

  const { pause, resume, stop } = watch(
    () => chatsRef.value[chatsRef.value.length - 1],
    () => {
      if (containerRef.value && isAutoScroll.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight
      }
    },
    { flush: 'post' },
  )

  return { isAutoScroll, pause, resume, stop }
}
