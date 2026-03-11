// services/websocket.ts
import { ElNotification } from 'element-plus'
import { useAuthStore } from "@/store/auth";
import pinia from '@/store'; 
const authStore = useAuthStore(pinia);
class WS {
  private ws: WebSocket | null = null

  connect(token?: string) {
    if (this.ws) return

    this.ws = new WebSocket(`ws://localhost:8091/ws?token=${token || ''}`)

    this.ws.onopen = () => {
      console.log("WebSocket connected")
    }

    this.ws.onmessage = (event) => {

      const jsonData = JSON.parse(event.data);
      if (jsonData.title === "kickOut") {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        authStore.setIsLogin(false);
        ElNotification.error({
          title: '新消息',
          message: jsonData.content,
        })
      } else if(jsonData.title === "Login") {
        ElNotification.warning({
          title: '新消息',
          message: jsonData.content,
        })
      }
    }

    this.ws.onclose = () => {
      console.log("WebSocket closed")
      this.ws = null
    }
  }

  send(data: any) {
    this.ws?.send(JSON.stringify(data))
  }

  close() {
    this.ws?.close()
  }
}

export const wsService = new WS()
