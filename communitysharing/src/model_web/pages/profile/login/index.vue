<script setup lang="ts">
import phoneLogin from '@/model_web/pages/profile/phoneLogin/LoginPage.vue';
import passwordLogin from '@/model_web/pages/profile/passwordLogin/index.vue';
import mailLogin from '@/model_web/pages/profile/mailLogin/index.vue';
import { loginType } from '@/types/enum';
import type { LoginType } from '@/types/enum/enumType';
import { useAuthStore } from '@/store/auth';
import { computed } from 'vue';
const store = useAuthStore();
const logintype = computed(() => store.startLogin as LoginType)
const emit = defineEmits(['sendData'])
const getData = (data: UserInfo) => {
    // 这里可以根据需要处理接收到的数据
    emit('sendData', data); // 将数据传递给父组件
}
</script>

<template>
    <div class="web_login_sylloge">
        <phoneLogin @sendData="getData" v-if="logintype === loginType.phone"></phoneLogin>
        <passwordLogin @sendData="getData" v-else-if="logintype === loginType.password"></passwordLogin>
        <mailLogin @sendData="getData" v-else-if="logintype === loginType.mail"></mailLogin>
    </div>
</template>

<style scoped lang="less">
.web_login_sylloge {
    width: 100%;
    height: 100%;
}
</style>