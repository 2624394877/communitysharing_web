import { useAuthStore } from "@/store/auth";
import pinia from '@/store'; 
import axios from "axios";
import { ElNotification } from "element-plus";
const authStore = useAuthStore(pinia);
const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
});
instance.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log(token);
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error); // 抛出错误
    }
);
instance.interceptors.response.use(
    (response) => { 
        return response.status >= 200 && response.status < 300 ? Promise.resolve(response.data) : Promise.reject(response.data) // 响应成功
    },
    (error) => { 
        ElNotification({
            title: "请求失败",
            message: error.response.data.message+ ', 可能被他人挤掉线, 请重新登录',
            type: "error",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        authStore.setIsLogin(false);
        return Promise.reject(error)
    }
);
export default instance;