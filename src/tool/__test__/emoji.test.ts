import { it, describe, expect } from 'vitest'
import { h } from 'vue'

import { createEmojiMatchReg, defaultEmojiMaping, replaceTextToEmojiText } from '../emoji.ts'

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

describe('replaceTextToEmojiText', () => {
  it('应该正常工作', () => {
    const vnodeChild = replaceTextToEmojiText('1[花]23[dog]456')
    expect(vnodeChild).toEqual([
      '1',
      h('img', { src: defaultEmojiMaping['花'] }),
      '23',
      h('img', { src: defaultEmojiMaping['dog'] }),
      '456',
    ])
  })

  it('可以自定义正则', () => {
    const reg = createEmojiMatchReg(['dog'])
    const vnodeChild = replaceTextToEmojiText('1[花]23[dog]456', { regexp: reg })
    expect(vnodeChild).toEqual(['1[花]23', h('img', { src: defaultEmojiMaping['dog'] }), '456'])
  })

  it('可以自定义emoji映射', () => {
    const emojiMaping = { 花: 'url1', dog: 'url2' }
    const vnodeChild = replaceTextToEmojiText('1[花]23[dog]456', { emojiMaping })
    expect(vnodeChild).toEqual([
      '1',
      h('img', { src: emojiMaping['花'] }),
      '23',
      h('img', { src: emojiMaping['dog'] }),
      '456',
    ])
  })
})
