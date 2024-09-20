import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
//import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), //vueDevTools()
    VitePWA({
      manifest: {
        name: 'hash pwa',
        short_name: 'PWA',
        start_url: '/',
        display: 'standalone',
        theme_color: '#4DBA87',
        background_color: '#ffffff',
        icons: [
          {
            src: 'img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    })
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
      '^/dev-api': {
        target: ''
      }
    }
  }
})
