import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue,cjs}'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        node: true,
      },
    },
  },
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      'vue/return-in-computed-property': 'off',
    },
  },
  skipFormatting,
]
