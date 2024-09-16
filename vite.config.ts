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
    host: true,
    // 仅在 proxy 中配置的代理前缀， mock-dev-server 才会拦截并 mock
    // doc: https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    proxy: {
      "^/dev-api": {
        target: ""
      }
    }
  },
})
