export const isString = (o: unknown): o is string => typeof o === 'string'
export const isNumber = (o: unknown): o is number => typeof o === 'number' && !Number.isNaN(o)
export const isUndefined = (o: unknown): o is undefined => typeof o === 'undefined'
export const isBoolean = (o: unknown): o is boolean => typeof o === 'boolean'
export const isSymbol = (o: unknown): o is symbol => typeof o === 'symbol'
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (o: unknown): o is Function => typeof o === 'function'
export const isBigint = (o: unknown): o is bigint => typeof o === 'bigint'
export const isObject = (o: unknown): o is object => typeof o === 'object' && o !== null
export const isNull = (o: unknown): o is null => o === null
export const isArray = (o: unknown): o is unknown[] => Array.isArray(o)
/** 一个空箭头函数 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
