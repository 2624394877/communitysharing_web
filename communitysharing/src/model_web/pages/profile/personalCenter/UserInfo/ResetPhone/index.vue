<script setup lang="ts">
import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import { getUserInfo, getVerificationCode, resetPhone } from '@/core/network/service/auth';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
const router = useRouter();
const auth = useAuthStore();
const phone = ref<resetPhoneParams>({
    phone: '',
    code: ''
});
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
const phoneRegex = "^1[3-9]\\d{9}$"; // 手机号正则（11位）
const sendVerificationCode = async() => {
    const regexPattern = new RegExp(phoneRegex);
    if (!phone.value.phone) {
        ElNotification.error({
            title: '错误',
            message: '手机号不能为空，请输入手机号',
            offset: 100
        });
        return;
    }
    if (!regexPattern.test(phone.value.phone)) {
        ElNotification.error({
            title: '错误',
            message: '手机号格式不正确，请重新输入',
            offset: 100
        });
    } else {
        try {
            const res = await getVerificationCode(phone.value.phone);
            if (res.success) {
                countTimer();
                ElNotification.success({
                    title: '发送成功',
                    message: '验证码已发送，请注意查收',
                    offset: 100
                });
            } else {
                ElNotification.error({
                    title: '发送失败',
                    message: res.message,
                    offset: 100
                });
            }
        } catch (error) {
            ElNotification.error({
                title: '错误',
                message: '验证码发送失败，请稍后再试',
                offset: 100
            });
        }
    }
}

const userInfo = async () => {
    try {
        const res = await getUserInfo();
        if (res.success) {
            sessionStorage.setItem('userdetail', JSON.stringify(res.data));
            auth.setUserDetail(res.data);
            ElNotification.success({
                title: '获取成功',
                message: '信息获取成功',
                offset: 100
            });
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

const reset = async () => {
    try {
        const res = await resetPhone(phone.value);
        if (res.success) {
            userInfo();
            ElNotification.success({
                title: '手机号更换成功',
                message: '手机号已更换成功',
                offset: 100
            });
            router.push('/');
        } else {
            ElNotification.error({
                title: '手机号更换失败',
                message: res.message,
                offset: 100
            });
        }
    } catch (error) {
        ElNotification.error({
            title: '错误',
            message: '手机号更换失败，请稍后再试',
            offset: 100
        });
    }
}
</script>

<template>
    <div class="web_reset_password">
        <h3 style="text-align: center;color: red;">
            注意
            <p>手机号是主要登录方式，在登录前，无法修改邮箱或密码，或用其登录</p>
            <p>请妥善保管您的手机号</p>
        </h3>
        <div class="login">
            <input type="tel" inputmode="numeric" class="input_style phone" placeholder="请输入想要修改的手机号" v-model="phone.phone" />
        </div>
        <div class="login">
            <input type="text" class="input_style code" name="verification_code" v-model="phone.code"/>
            <el-button type="primary" @click="sendVerificationCode" class="sendCode" v-if="!arrived" link>发送验证码</el-button>
            <el-button type="primary" class="sendCode" v-if="arrived" plain disabled link>{{count}}秒</el-button>
        </div>
        <div class="submit">
            <el-button type="primary" class="btn" @click="reset" plain>更换</el-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.web_reset_password{
    width: 60%;
    height: 60%;
    margin: 0 auto;

    .reset {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;

        span {
            font-size: 18px;
            margin-right: 10px;
        }
    }

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

    .submit {
        width: 40%;
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