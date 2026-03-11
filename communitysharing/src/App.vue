<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import WebRoot from '@/model_web/main.vue'
import AppRoot from '@/model_app/main.vue'
import { initAuth } from '@/assets/init'
import { wsService } from './core/service/websocket';
const isMobile = ref(false);
const checkMobile = () => {
  const ua = navigator.userAgent;
  isMobile.value = window.innerWidth < 1000 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

onBeforeMount(() => {
  initAuth()
  wsService.connect(localStorage.getItem("token") || '');
})

onMounted(() => {
  initAuth()
  window.addEventListener('resize', checkMobile); // 监听窗口大小变化
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile); // 移除监听
});
</script>

<template>
  <div class="box">
    <component :is="isMobile ? AppRoot : WebRoot"></component>
  </div>
</template>

<style scoped>
</style>
