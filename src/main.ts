import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import NutUI from '@nutui/nutui'
import '@nutui/nutui/dist/style.css'
import VueNativeSock from 'vue-native-websocket-vue3'

const app = createApp(App)
// Replace 'ws://your-websocket-server' with your actual WebSocket server URL
// app.use<any>(VueNativeSock, 'ws://your-websocket-server', {
//   // Optional settings
//   reconnection: true, // (Boolean) whether to reconnect automatically (default true)
//   reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (default Infinity)
//   reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (default 1000)
// })
app.use(createPinia())
app.use(router)
app.use(NutUI)
app.mount('#app')
