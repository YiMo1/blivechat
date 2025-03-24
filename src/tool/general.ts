export const isString = (o: unknown): o is string => typeof o === 'string'
export const isNumber = (o: unknown): o is number => typeof o === 'number' && !Number.isNaN(o)
export const isUndefined = (o: unknown): o is undefined => typeof o === 'undefined'
export const isBoolean = (o: unknown): o is boolean => typeof o === 'boolean'
export const isSymbol = (o: unknown): o is symbol => typeof o === 'symbol'
export const isFunction = (o: unknown): o is Function => typeof o === 'function'
export const isBigint = (o: unknown): o is bigint => typeof o === 'bigint'
export const isObject = (o: unknown): o is object => typeof o === 'object' && o !== null
export const isNull = (o: unknown): o is null => o === null
export const isArray = (o: unknown): o is unknown[] => Array.isArray(o)
/** 一个空箭头函数 */

export const noop = () => {}

type RandomNumberOptions = {
  /** @default 1 */
  max?: number
  /** @default 0 */
  min?: number
  /** @default true */
  interger?: boolean
}
export function randomNumber(options: RandomNumberOptions = {}) {
  const { min = 0, max = 1, interger = true } = options
  if (min > max) {
    throw new Error('最小值不能大于最大值')
  }
  const n = Math.random() * (max - min) + min
  return interger ? Math.round(n) : n
}

/** 从数组中随机取一个 */
export function randomByArray<T>(arr: T[]): T {
  return arr[randomNumber({ max: arr.length - 1 })]
}

/**
 * 确定数组是否包含特定元素，和原生includes函数不同的是存在类型保护
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * const searchElement: any = 1
 * if (arr.includes(searchElement)) {
 *   const result = searchElement // result类型为any
 * }
 * if (Array.prototype.includes.call(arr, searchElement)) {
 *   const result = searchElement // result类型为any
 * }
 * if (includesByArray(arr, searchElement)) {
 *   const result = searchElement // result类型为number
 * }
 * ```
 */
export function includesByArray<T>(
  arr: T[],
  searchElement: unknown,
  fromIndex?: number,
): searchElement is T {
  return Array.prototype.includes.call(arr, searchElement, fromIndex)
}
