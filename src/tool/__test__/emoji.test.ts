import { it, describe, expect } from 'vitest'
import { createEmojiMatchReg } from '../emoji.ts'

describe('createEmojiMatchReg', () => {
  it('应该返回一个全局正则对象', () => {
    const reg = createEmojiMatchReg([])
    expect(reg).toBeInstanceOf(RegExp)
    expect(reg.global).toBe(true)
  })

  it('返回的正则对象能正常工作', () => {
    const reg = createEmojiMatchReg(['dog', '花'])
    const input = '1[花]23[dog]456'
    const matchResult = input.match(reg)
    expect(matchResult).toEqual(['[花]', '[dog]'])
  })
})
