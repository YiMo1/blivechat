import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier/recommended'
import tailwindcss from 'eslint-plugin-tailwindcss'
import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

import { include } from './tsconfig.node.json'

export default ts.config(
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  vue.configs['flat/recommended'],
  tailwindcss.configs['flat/recommended'],
  prettier,
  {
    ignores: include,
    rules: { 'import-x/no-nodejs-modules': 'error' },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
    rules: { 'no-undef': 'off' },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: { parserOptions: { projectService: true, extraFileExtensions: ['vue'] } },
  },
  {
    rules: {
      // tailwindcss
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      // js
      eqeqeq: 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-spread': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      // ts
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // import-x
      'import-x/no-absolute-path': 'error',
      'import-x/no-unresolved': ['error', { ignore: ['^@/'] }],
      'import-x/no-amd': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/no-import-module-exports': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-mutable-exports': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/newline-after-import': [
        'error',
        { count: 1, exactCount: true, considerComments: true },
      ],
      'import-x/no-deprecated': 'error',
      'import-x/no-empty-named-blocks': 'error',
      'import-x/no-self-import': 'error',
      'import-x/first': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            orderImportKind: 'desc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          distinctGroup: false,
          warnOnUnassignedImports: true,
          pathGroupsExcludedImportTypes: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
      // vue
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        { registeredComponentsOnly: false },
      ],
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
    },
  },
)
