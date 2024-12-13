// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['node_modules/*', 'temp/*', '**/dist'] },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  prettierPlugin,
  prettierConfig,
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
