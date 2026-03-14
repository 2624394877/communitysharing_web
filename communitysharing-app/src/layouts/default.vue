<script setup lang="ts">
import { getRouterName } from '@/composables/useRoutePos';
</script>

<template>
   <view>
    <view class="header">
      <SearchInput :name="getRouterName()"/>
    </view>
    <view class="body">
      <slot></slot>
    </view>
    <view class="footer">
      <TabBar/>
    </view>
  </view>
</template>

<style scoped>
.header {
  width: 750rpx;
  height: 150rpx;
  margin: 0 auto;
}
</style>