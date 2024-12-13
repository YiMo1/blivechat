// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import prettierConfig from 'eslint-config-prettier'
import vuePlugin from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'
import tsEslintParser from '@typescript-eslint/parser'

export default tseslint.config(
  { ignores: ['node_modules/*', 'temp/*', '**/dist'] },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  ...vuePlugin.configs['flat/recommended'],
  prettierPlugin,
  prettierConfig,
  {
    files: ['**/*.vue', '*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsEslintParser,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      eqeqeq: 'error',
      'prefer-template': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'object-shorthand': 'error',
    },
  },
)
