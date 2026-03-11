<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { loginType } from "@/types/enum";
import { ElNotification } from 'element-plus';
import { getVerificationCodeByMail, LoginByEmail, getLoginUserInfo } from "@/core/network/service/auth";

import type { LoginType } from "@/types/enum/enumType";
import { wsService } from "@/core/service/websocket";
const auth = useAuthStore();
const mail = ref<mailloginParams>({
    email: '',
    code: ''
});
const emit = defineEmits(['sendData'])
// ---------- 发送验证码
const count = ref(120);
const arrived = ref(false);

const countTimer = () => {
    if (count.value <= 0) {
        count.value = 120;
        arrived.value = false;
        return;
    }
    arrived.value = true;
    count.value--;
    setTimeout(countTimer, 1000);
}

const sendVerificationCode = async() => {
    // 正则校验邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail.value.email)) {
        ElNotification.error({
            title: '邮箱格式错误',
            message: '请输入正确的邮箱格式',
            duration: 2000
        });
    } else {
        try {
            const res = await getVerificationCodeByMail(mail.value.email);
            if (res.success) {
                countTimer();
                ElNotification.success({
                    title: '发送成功',
                    message: '请查收邮件',
                    offset: 100
                })
            } else {
                ElNotification.error({
                    title: '发送失败',
                    message: res.message,
                    offset: 100
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
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

const login = async() => { 
    try {
        const res = await LoginByEmail(mail.value);
        if (res.success) {
            ElNotification.success({
                title: '成功',
                message: '登录成功',
                offset: 100,
            });
            getUserInfo();
            mail.value.code = ''
            localStorage.setItem('token',res.data)
            auth.setIsLogin(true); // 设置登录状态到pinia
            wsService.connect(localStorage.getItem('token') || ''); // 连接WebSocket
        } else {
            ElNotification.error({
                title: '失败',
                message: res.message,
                offset: 100,
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// 选择登录方式
const LoginType = (type: LoginType) => {
    auth.setStartLogin(type)
}
</script>

<template>
    <div class="web_login">
        <div class="login">
            <span>邮箱</span>
            <input type="email" class="input_style phone" v-model="mail.email" />
        </div>
        <div class="login">
            <input type="text" class="input_style code" name="verification_code" v-model="mail.code"/>
            <el-button type="primary" @click="sendVerificationCode" class="sendCode" v-if="!arrived" link>发送验证码</el-button>
            <el-button type="primary" class="sendCode" v-if="arrived" plain disabled link>{{count}}秒</el-button>
        </div>
        <div class="to_login_for_mail">
            <span class="password" @click="LoginType(loginType.password)"><a>密码登录</a></span>
            <span class="mail" @click="LoginType(loginType.phone)"><a>手机号登录</a></span>
        </div>
        <div class="submit">
            <el-button type="primary" class="btn" @click="login" plain>登录</el-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.web_login{
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