import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/ocr/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'target/dist', // 设置输出目录为 target/dist
  },
  server: {
    proxy: {
      '/zcocr': {
        target: 'http://192.168.3.55:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zcocr/, ''),
      },
    },
  },
})
