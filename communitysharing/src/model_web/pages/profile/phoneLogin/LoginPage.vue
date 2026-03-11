<script setup lang="ts">
import { ref, type Ref } from "vue";
import { getVerificationCode, Login, getLoginUserInfo } from "@/core/network/service/auth"
import { ElNotification } from 'element-plus'
import { useAuthStore } from "@/store/auth";
import { loginType } from "@/types/enum";
import type { LoginType } from "@/types/enum/enumType";
import { wsService } from "@/core/service/websocket";
import { useRouter } from "vue-router";
const auth = useAuthStore();
const agree = ref(false); // 是否同意协议
const userLoginInfo:Ref<LoginParams> = ref({
    phone: '',
    code: '',
    type: '1'
});
const emit = defineEmits(['sendData'])
// ---------- 发送验证码
const count = ref(120);
const arrived = ref(false);
const router = useRouter()
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
    try {
        const res = await getVerificationCode(userLoginInfo.value.phone);
        if (res.success) {
            countTimer();
            ElNotification.success({
                title: '成功',
                message: '验证码已发送',
                offset: 100,
            })
        } else {
            ElNotification.error({
                title: '失败',
                message: res.message?.split(",当前值:")[1] || res.message,
                offset: 100,
            })
        }
    } catch (error) {
        console.log(error);
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
// ------------ 登录
const login = async() => {
    if (agree.value) {
        try {
            const res = await Login(userLoginInfo.value);
            if(res.success) {
                ElNotification.success({
                    title: '成功',
                    message: '登录成功',
                    offset: 100,
                });
                getUserInfo(); // 获取用户信息
                userLoginInfo.value.code = ''
                localStorage.setItem('token',res.data)
                auth.setIsLogin(true); // 设置登录状态到pinia
                wsService.connect(localStorage.getItem('token') || ''); // 连接WebSocket
                router.replace('/discover')
            }else {
                ElNotification.error({
                    title: '失败',
                    message: res.message,
                    offset: 100,
                })
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        ElNotification.warning({
            title: '提示',
            message: '"请先阅读并同意用户协议"',
            offset: 100,
        })
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
            <span>+86</span>
            <input type="text" class="input_style phone" v-model="userLoginInfo.phone" />
        </div>
        <div class="login">
            <input type="text" class="input_style code" v-model="userLoginInfo.code" />
            <el-button type="primary" @click="sendVerificationCode" class="sendCode" v-if="!arrived" link>发送验证码</el-button>
            <el-button type="primary" class="sendCode" v-if="arrived" plain disabled link>{{count}}秒</el-button>
        </div>
        <div class="to_login_for_mail">
            <span class="password" @click="LoginType(loginType.password)"><a>密码登录</a></span>
            <span class="mail" @click="LoginType(loginType.mail)"><a>邮箱登录</a></span>
        </div>
        <div class="submit">
            <el-button type="primary" class="btn" plain @click="login">登录</el-button>
        </div>
        <div class="checked">
            <el-checkbox v-model="agree" class="el-check">
                我已阅读并同意
            </el-checkbox>
            <span class="link">《用户协议》</span>
            <span class="link">《隐私政策》</span>
            <span class="link">《儿童/青少年个人信息保护规则》</span>
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
    .checked {
        width: 70%;
        height: 44px;
        margin: 0 auto;
        margin-bottom: 30px;
        white-space: normal;
        font-size: 12px;
        text-align: center;
        .el-check {
            white-space: normal;
            word-break: break-all;
            font-size: 12px; 
        }
        .link {
            color: #6ac2e4;
            margin: 0 5px;
        }
        
        .link:hover {
            cursor: pointer;
            color: #198fde;
        }
    }
}
</style>