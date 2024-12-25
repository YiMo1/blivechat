// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import prettierConfig from 'eslint-config-prettier'
import vuePlugin from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'
import * as tsEslintParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import-x'

export default tseslint.config(
  { ignores: ['node_modules', 'temp', 'dist'] },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...vuePlugin.configs['flat/recommended'],
  prettierPlugin,
  prettierConfig,
  {
    files: ['**/*.vue', '*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsEslintParser,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      eqeqeq: 'error',
      'prefer-template': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'object-shorthand': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case', { registeredComponentsOnly: false }],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/no-multiple-objects-in-class': 'error',
      'vue/no-potential-component-option-typo': 'error',
      'vue/prefer-prop-type-boolean-first': 'error',
      'vue/prefer-define-options': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/multi-word-component-names': 'off',
      'import-x/newline-after-import': ['error', { count: 1, exactCount: true, considerComments: true }],
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-deprecated': 'warn',
      'import-x/no-empty-named-blocks': 'error',
      'import-x/no-self-import': 'error',
      'import-x/first': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
        },
      ],
    },
  },
)
