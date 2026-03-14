<script setup lang="ts">
import { ref } from 'vue'

const reseach_text = ref('')

const search = () => {
  if (!reseach_text.value) return

  uni.navigateTo({
    url: `/pages/search/index?text=${reseach_text.value}&time=${Date.now()}`
  })
}
</script>

<template>
  <view class="web_reseach">

    <input
      class="search_input"
      type="text"
      placeholder="输入内容标题或主题关键词搜索"
      v-model="reseach_text"
      @confirm="search"
    />

    <view class="search_icon" @click="search">
      <v-icon name="co-search" scale="1.5" />
    </view>

  </view>
</template>

<style scoped lang="less">
.web_reseach {
  width: 400rpx;
  height: 88rpx;
  margin: 0 auto;
  background: #eee;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx 0 36rpx;
  font-size: 20rpx;
}

.search_input {
  flex: 1;
  border: none;
  background: transparent;
}

.search_icon {
  margin-left: 20rpx;
}
</style>