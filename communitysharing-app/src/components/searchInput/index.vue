<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{name: string}>()

const reseach_text = ref('')

const search = () => {
  if (!reseach_text.value) return

  uni.navigateTo({
    url: `/pages/search/index?text=${reseach_text.value}&time=${Date.now()}`
  })
}
console.log(props.name)
</script>

<template>
  <view class="search">
    <view class="title"></view>
    <view class="web_reseach">
      <input
        class="search_input"
        type="text"
        placeholder="输入内容标题或主题关键词搜索"
        v-model="reseach_text"
        @confirm="search"
      />
      <view class="search_icon" @click="search">
        <v-icon name="co-search" scale="0.5" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="less">
.search {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  justify-content: center;
  margin: 0 auto;


  .title {
    height: 80rpx;
  }

  .web_reseach {
    height: 100%;
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
}
</style>