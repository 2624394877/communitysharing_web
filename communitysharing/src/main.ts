import { createApp } from 'vue'
import './style.css'
import pinia from '@/store'
import router from '@/router'
import installIcons from '@/icons'
import { getDeviceType } from './utils/device'
import { initAuth } from '@/assets/init'
import { wsService } from './core/service/websocket';

// 
initAuth()
wsService.connect(localStorage.getItem("token") || '');

// ⭐ 顶层 await（Vite支持）
const device = getDeviceType()

const RootComponent = device === 'mobile'
  ? (await import('./model_app/main.vue')).default
  : (await import('./model_web/main.vue')).default

const app = createApp(RootComponent)

app.use(pinia)
app.use(router)
app.use(installIcons)

app.mount('#app')