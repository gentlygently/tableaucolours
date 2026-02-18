import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import standardConfig from '@vue/eslint-config-standard'

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
        window: true,
        document: true,
        navigator: true,
        localStorage: true,
        confirm: true,
        FileReader: true,
        Image: true,
        HTMLImageElement: true,
        DOMParser: true,
        XMLSerializer: true,
      },
    },
  },
  ...pluginVue.configs['flat/essential'],
  ...standardConfig,
  skipFormatting,
]
