<script setup lang="ts">
import { reactive, watch} from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getUserInfo } from '@/core/network/service/auth'
import { ElNotification } from 'element-plus';
import { useAuthStore } from '@/store/auth'
const auth = useAuthStore();
const router = useRoute();

const getInfo = async () => {
    if (auth.userdetail.communitysharingId === undefined) {
        try {
            const res = await getUserInfo();
            if (res.success) {
                sessionStorage.setItem('userdetail', JSON.stringify(res.data));
                ElNotification.success({
                    title: '查询成功',
                    message: '已获取信息',
                });
            } else {
                ElNotification.error({
                    title: '查询失败',
                    message: res.message,
                    offset: 100,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const list = reactive([
    { name: '个人主页', path: '/Personal/home' },
    { name: '个人信息', path: '/Personal/info', getInfo },
    { name: '我的内容', path: '/Personal/content' },
    { name: '浏览记录', path: '/Personal/record' },
    { name: '我的收藏', path: '/Personal/collect' },
    { name: '我的关注', path: '/Personal/follow' },
]);
const listClassName = reactive({
    activeEl: '/Personal/home',
    hover: 'hover'
});
watch(() => router.path, (newValue) => { listClassName.activeEl = newValue;})

</script>

<template>
    <div class="web_personal">
        <div class="left">
            <ul>
                <li v-for="(item,index) in list" :key="index"><router-link :to="item.path" :class="item.path === listClassName.activeEl ? listClassName.hover : ''" @click="item.getInfo">{{ item.name }}</router-link></li>
            </ul>
        </div>
        <div class="right"><RouterView></RouterView></div>
    </div>
</template>

<style scoped lang="less">
.web_personal{
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: "Microsoft YaHei";

    .left {
        // background: #f7f7f7;
        border-right: 1px #e2e2e2 solid;
        min-height: 600px;
        width: 200px;
        float: left;

        ul {
            text-align: center;
            li {
                box-sizing: border-box;
                border-bottom: 1px #e2e2e2 solid;
                a {
                    line-height: 45px;
                    height: 45px;
                    display: block;
                }
            }
        }
    }

    .right {
        width: calc(100% - 202px);
        min-height: 600px;
        float: right;
        background-color: #f5f5f5;
        box-sizing: border-box;
    }
}
.hover {
    background: #fff;
    border-left: 4px #3577CE solid;
    text-indent: -4px;
    width: 197px;
    box-sizing: border-box;
}
</style>