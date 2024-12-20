declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare const __ACCESS_KEY_ID__: string
declare const __ACCESS_KEY_SECRED__: string
declare const __PROJECT_ID__: string
declare const __CODE__: string
declare const __DEV__: boolean
declare const __BASE_URL__: string
declare const __PORT__: number
declare type StrictOmit<T, K extends keyof T> = Omit<T, K>
declare const ElMessage: typeof import('element-plus').ElMessage
declare const ElMessageBox: typeof import('element-plus').ElMessageBox
declare const EmojiText: typeof import('src/component/EmojiText.vue').default
