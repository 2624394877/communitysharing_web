<script setup lang="ts">
const go = (url:string) => {
    uni.navigateTo({ url: `/pages/${url}` })
}
</script>

<template>
    <view class="tabBar">
        <view class="bar" @click="go('index')">首页</view>
        <view class="bar" @click="go('discover/index')">发现</view>
        <view class="bar" @click="go('user/index')">我的</view>
    </view>
</template>

<style scoped lang="less">
.tabBar {
    width: 100%;
    height: 140rpx;
    background-color: antiquewhite;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>