import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx() //vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/custom_theme.scss";
          @import "@nutui/nutui/dist/styles/variables.scss";
        `
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 目标服务器地址
        changeOrigin: true, // 是否改变请求头中的 Origin
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  }
})
