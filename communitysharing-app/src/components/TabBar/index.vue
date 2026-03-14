<script setup lang="ts">
import { RouterName } from '@/composables/useRoutePos';

const go = (url:string,name: string) => {
    uni.navigateTo({ 
        url: `/pages/${url}`,
        animationType: 'fade-in',
        animationDuration: 300
     })
    RouterName(name);
}
</script>

<template>
    <view class="tabBar">
        <view class="bar" @click="go('index','首页')">首页</view>
        <view class="bar" @click="go('discover/index','发现')">发现</view>
        <view class="bar" @click="go('user/index','我的')">我的</view>
    </view>
</template>

<style scoped lang="less">
.tabBar {
    width: 100%;
    height: 140rpx;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid black;
}
</style>