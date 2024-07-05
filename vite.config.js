import { defineConfig } from 'vite'
//import vue from '@vitejs/plugin-vue'
import { createVuePlugin as vue } from "vite-plugin-vue2";
import autoprefixer from "autoprefixer";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ 
    compilerOptions: { 
        whitespace: 'condense',
    }
})],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})