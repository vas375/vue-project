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
  }
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //       @media screen and (max-width: 450px) {
  //         body {
  //           font-size: calc(100vw / 375 * 16);
  //         }
  //       }
  //     `
  //     }
  //   }
  // }
})
