import { defineConfig } from 'vite'
//import vue from '@vitejs/plugin-vue'
import vue from '@vitejs/plugin-vue2'
import autoprefixer from 'autoprefixer'
import eslintPlugin from 'vite-plugin-eslint'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      compilerOptions: {
        whitespace: 'condense',
      },
    }),
    eslintPlugin(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
