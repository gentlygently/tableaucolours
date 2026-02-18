import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer'
import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineTestConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
const config = defineConfig({
  // plugins: [vue(), vueDevTools()],
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

const testConfig = defineTestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/testing/test-setup.js'],
    exclude: ['**/node_modules/**', '**/dist/**', '*.test.js'],
    deps: {
      optimizer: {
        web: {
          include: ['vitest-canvas-mock'],
        },
      },
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})

export default mergeConfig(config, testConfig)
