import { createRouter, createWebHashHistory } from "vue-router";
import webRoutes from "@/model_web/router";
import appRoutes from "@/model_app/router";
import { ElNotification } from 'element-plus'
import { getUserInfo } from '@/core/network/service/auth'
const isMobile = window.innerWidth < 1000; // 简单的判断是否为移动设备，可以根据需要调整
const routes = isMobile ? appRoutes : webRoutes
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 登录拦截
router.beforeEach((to, from, next) => { 
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    ElNotification.warning({
      title: '提示',
      message: '请先登录',
      offset: 100
    })
    next('/')
  } else {
    next()
  }
});

// 获取用户信息（前路由守卫）
router.beforeEach(async(to, from, next) => {
  if (to.meta.needUserInfo && sessionStorage.getItem('userInfo') === null) { 
    try {
      const res = await getUserInfo()
      if (res.success) {
            sessionStorage.setItem('userdetail', JSON.stringify(res.data));
      }
    } catch (e) { 
      console.log(e)
    }
  }
  next()
})
export default router;