<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
/**
 * 创建一个ref对象，用于存储input元素
 * @param {HTMLInputElement} input - input元素
 * @desc 只有Vue将元素挂载之后才能操作到元素
 */
const input = ref<HTMLInputElement | null>(null);
const router = useRouter();

let reseach_text = ref('')
const search = () => {
    // todo 搜索功能
    router.push({ path: '/search', query: { text: reseach_text.value,time: new Date().getTime() } })
}

</script>

<template>
    <!-- 搜索框 -->
        <span class="web_reseach" @click="input?.focus()">
            <input ref="input" type="text" placeholder="输入内容标题或主题关键词搜索" v-model="reseach_text" @keyup.enter="search"></input>
        <span @click="search"><v-icon name="co-search" scale="1.5" animation="pulse" speed="slow" fill="#779ef2"/></span>
    </span>
</template>

<style scoped lang="less">
.web_reseach {
    width: 400px;
    height: 44px;
    margin: 0 auto;
    background: #eee;
    border-radius: 999px;
    /* 圆角 */
    display: flex;
    align-items: center;
    padding: 0 14px 0 18px;

    input {
        flex: 1;
        border: none;
        background: transparent;
        /* 去掉input的背景色 */
        outline: none;
        /* 去掉input的轮廓线 */
    }

    input:focus {
        caret-color: @caret-color;
    }

    span:hover {
        cursor: pointer;
        color: #779ef2;
    }
}
.web_reseach:hover {
    border: #779ef2 1px solid;
}
</style>