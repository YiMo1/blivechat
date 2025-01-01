export { default as EmojiText } from './EmojiText.vue'

declare module 'vue' {
  export interface GlobalComponents {
    EmojiText: typeof EmojiText
  }
}
