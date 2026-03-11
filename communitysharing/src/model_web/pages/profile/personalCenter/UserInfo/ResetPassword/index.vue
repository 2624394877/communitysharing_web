<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
import { resetPassword } from '@/core/network/service/auth';
const password = ref<string>('');
const tip = reactive({
    context: '由字母，数字，和特殊字符中的任意一个(! .~)组合, 长度在6-11个字符之间',
})
const regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!~.])[A-Za-z0-9!~.]{6,11}$"; // 密码正则：至少包含字母、数字及特殊字符(! .~)，长度6-11

const reset = async () => {
    const regexPattern = new RegExp(regex);
    if (!regexPattern.test(password.value)) {
        ElNotification.error({
            title: '错误',
            message: '密码不符合要求，请按照提示输入',
            offset: 100
        });
        return;
    }
    // 这里可以添加实际的密码重置逻辑，例如调用API接口等
    try {
        const res = await resetPassword(password.value);
        if (res.success) {
            ElNotification.success({
                title: '成功',
                message: '密码重置成功',
                offset: 100
            });
        } else {
            ElNotification.error({
                title: '错误',
                message: res.message,
                offset: 100
            });
        }
    } catch (error) {
        ElNotification.error({
            title: '错误',
            message: '密码重置失败，请稍后再试',
            offset: 100
        });
    }
}
</script>

<template>
    <div class="web_reset_password">
        <h3 style="text-align: center;color: red;">
            注意
            <p>密码和邮箱均为备用登录方式，以防止手机号不可用，而无法登录</p>
            <p>请妥善保管您的密码和邮箱信息</p>
        </h3>
        <div class="reset">
            <span>密码:</span>
            <el-tooltip class="box-item" effect="dark" :content="tip.context" placement="top">
                <el-input v-model="password" style="width: 240px" type="password" placeholder="请输入想要修改的密码" show-password validate-event />
            </el-tooltip>
        </div>
        <div class="submit">
            <el-button type="primary" class="btn" @click="reset" plain>重置</el-button>
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