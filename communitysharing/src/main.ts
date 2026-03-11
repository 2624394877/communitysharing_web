import { createApp } from 'vue'
import './style.css'
import '@/model_web/main'
import pinia from '@/store'
import router from '@/router'
import App from './App.vue'
import installIcons from '@/icons'


const app = createApp(App)
app.use(installIcons)
app.use(pinia)
app.use(router)

app.mount('#app')

