<script lang="tsx">
import { defineComponent, type PropType, type SlotsType } from 'vue'

import { createEmojiMatchReg, defaultEmojiMaping, replaceTextToEmojiText } from '@/tool/emoji.ts'

const reg = createEmojiMatchReg(Object.getOwnPropertyNames(defaultEmojiMaping))

export default defineComponent({
  name: 'EmojiText',
  props: {
    text: { type: String, default: '', required: false },
    regexp: { required: false, type: RegExp, default: () => reg },
    emojiMaping: {
      type: Object as PropType<Record<string, string>>,
      required: false,
      default: () => defaultEmojiMaping,
    },
  },
  slots: Object as SlotsType<{ default(): any }>,
  render() {
    const emojiText = replaceTextToEmojiText(this.$props.text, {
      emojiMaping: this.$props.emojiMaping,
      regexp: this.$props.regexp,
    })
    return <span>{emojiText}</span>
  },
})
</script>
