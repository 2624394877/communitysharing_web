import { useAuthStore } from '@/store/auth'
import { ElNotification } from 'element-plus'
export function initAuth() {
  const auth = useAuthStore()

  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')

  if (token) {
    auth.token = token
    auth.isLogin = true
  }

  if (userInfo) {
    try {
      auth.userInfo = JSON.parse(userInfo)
    } catch (e) {
      console.log('userInfo 解析失败')
      ElNotification.error({
          title: "错误",
          message: "信息获取错误，请刷新页面",
          offset: 100,
      })
    }
  }
}