import type { GUARD_LEVEL } from '@/tool/index.ts'

export interface Guard {
  id: string
  uface: string
  uname: string
  level: Exclude<GUARD_LEVEL, GUARD_LEVEL.NONE>
}
