declare module 'vue' {
  export interface GlobalComponents {
    EmojiText: typeof import('./EmojiText.vue').default
  }
}

export {}
