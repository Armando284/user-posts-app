import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message:
            'Avoid dangerouslySetInnerHTML. Render untrusted content as text or sanitize it first.',
        },
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: 'Avoid assigning innerHTML. Render untrusted content as text.',
        },
        {
          selector: "AssignmentExpression[left.property.name='outerHTML']",
          message: 'Avoid assigning outerHTML. Render untrusted content as text.',
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: 'Avoid insertAdjacentHTML. Render untrusted content as text.',
        },
        {
          selector:
            "CallExpression[callee.object.name='document'][callee.property.name=/^write(ln)?$/]",
          message: 'Avoid document.write. Use React rendering instead.',
        },
      ],
    },
  },
])
