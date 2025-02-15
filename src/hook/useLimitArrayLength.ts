import { DEFUALT_CHAT_RETAINED_QUANTITY } from '@/tool/index.ts'

export interface UseLimitArrayLengthOptions {
  /**
   * 数组最大长度
   * @default DEFUALT_CHAT_RETAINED_QUANTITY
   * @see {@link DEFUALT_CHAT_RETAINED_QUANTITY}
   */
  maxLength?: number
  /**
   * 超出最大长度时选择移除头部还是尾部
   * @default 'tail'
   */
  remove?: 'head' | 'tail'
  /**
   * 是否立即触发限制数组长度
   * @default true
   */
  immediate?: boolean
}

export function useLimitArrayLength(array: MaybeRef<unknown[]>, options: UseLimitArrayLengthOptions = {}) {
  const { maxLength = DEFUALT_CHAT_RETAINED_QUANTITY, immediate = true, remove = 'tail' } = options
  const arrayRef = toRef(array)

  const { pause, resume, stop } = watch(
    () => arrayRef.value.length,
    (value) => {
      if (value > maxLength) {
        arrayRef.value = remove === 'head' ? arrayRef.value.slice(-maxLength) : arrayRef.value.slice(0, maxLength)
      }
    },
    { immediate },
  )

  return { pause, resume, stop }
}
