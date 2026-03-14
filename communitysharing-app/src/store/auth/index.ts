import { defineStore } from 'pinia'
import type { LoginType } from '@/types/enum/enumType';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    isLogin: false,
    startLogin: 1 as LoginType,
    userInfo: {} as UserInfo,
    userdetail: {} as AuthDetail,
  }),
  actions: {
    setIsLogin(isLogin: boolean) {
        this.isLogin = isLogin
    },
    setStartLogin(startLogin: LoginType) {
        this.startLogin = startLogin
    },
    setUserDetail(userDetail: AuthDetail) {
        this.userdetail = userDetail
    },
    setUserInfo(userInfo: UserInfo) {
        this.userInfo = userInfo
    }
  },
})