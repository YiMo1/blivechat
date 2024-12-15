declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare const BASE_URL: string
declare type StrictOmit<T, K extends keyof T> = Omit<T, K>
declare const ElMessage: typeof import('element-plus').ElMessage
