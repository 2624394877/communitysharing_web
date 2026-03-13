import { createApp } from 'vue'
import './style.css'
import pinia from '@/store'
import router from '@/router'
import App from './App.vue'
import installIcons from '@/icons'
const isMobile = window.innerWidth < 1000
if (isMobile) {
  import ('@/model_app/main')
} else {
  import('@/model_web/main')
}

const app = createApp(App)
app.use(installIcons)
app.use(pinia)
app.use(router)

app.mount('#app')

