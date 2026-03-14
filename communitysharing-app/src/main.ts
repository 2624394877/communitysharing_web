import { createSSRApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import installIcons from '@/icons'

export function createApp() {
  const app = createSSRApp(App)

  installIcons(app)

  return {
    app
  }
}