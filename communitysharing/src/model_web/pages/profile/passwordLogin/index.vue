<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { loginType } from "@/types/enum";
import type { LoginType } from "@/types/enum/enumType";
import { Login, getLoginUserInfo } from "@/core/network/service/auth";
import { ElNotification } from 'element-plus'
import { wsService } from "@/core/service/websocket";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const password = ref<LoginParams>({
    phone: '',
    password: '',
    type: '2' as const
})
const emit = defineEmits(['sendData'])
const router = useRouter()
// 选择登录方式
const logintype = (type: LoginType) => {
    auth.setStartLogin(type)
}

// ----- 个人信息获取
const getUserInfo = async() => {
    try {
        const res = await getLoginUserInfo();
        if (res.success) {
            localStorage.setItem('userInfo',JSON.stringify(res.data));
            emit('sendData', res.data); // 将数据传递给父组件
        } else {
            ElNotification.warning({
                title: '警告',
                message: '信息获取失败，尝试重新登录',
                offset: 100
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const toLogin = async() => {
    try {
        const res = await Login(password.value);
        if (res.success) {
            getUserInfo();
            ElNotification.success({
                title: '登录成功',
                message: '欢迎回来！',
                offset: 100
            })
            password.value = {phone: '', password: '', type: '2' as const};
            localStorage.setItem('token',res.data);
            auth.setIsLogin(true);
            wsService.connect(localStorage.getItem('token') || '');
            router.replace('/discover')
        } else {
            ElNotification.error({
                title: '登录失败',
                message: res.message,
                offset: 100
            })
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="web_password_login">
        <div class="login">
            <span style="font-size: 12px;">手机号</span>
            <input type="text" class="input_style phone" v-model="password.phone" />
        </div>
        <div class="login">
            <span style="font-size: 12px;">密码</span>
            <input type="password" class="input_style password" v-model="password.password" />
        </div>
        <div class="to_login_for_mail">
            <span class="password" @click="logintype(loginType.phone)"><a>手机号登录</a></span>
            <span class="mail" @click="logintype(loginType.mail)"><a>邮箱登录</a></span>
        </div>
        <div class="submit">
            <el-button type="primary" class="btn" @click="toLogin" plain>登录</el-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.web_password_login{
    width: 100%;
    height: 100%;
    .login {
        position: relative;
        width: 70%;
        height: 44px;
        margin: 15px auto;
        background: #eee;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        
        span {
            font-size: 14px;
            padding-right: 5px;
            border-right: 1px solid #ccc;
        }

        input { 
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            padding-left: 10px;
        }

        .input_style:focus {
            caret-color: @caret-color;
        }

        .sendCode {
            position: absolute;
            right: 10px;
        }
    }
    .to_login_for_mail {
        width: 70%;
        height: 44px;
        margin: 0 auto;
        padding: 0 20px;
        .password {
            float: left;
            text-decoration: underline;
            a {
                color: #6ac2e4;
            }

        }
        .mail {
            float: right;
            text-decoration: underline;
            a {
                color: #6ac2e4;
            }
        }
        .mail:hover,.password:hover {  
            cursor: pointer;
            a {
                color: #198fde;
            }
        }
        
    }
    .submit {
        width: 70%;
        height: 44px;
        margin: 0 auto;
        margin-top: 15px;
        display: flex;
        align-items: center;
        
        .btn {
            flex: 1;
            width: 100%;
            height: 100%;
            border-radius: 999px;
        }
    }
}
</style>