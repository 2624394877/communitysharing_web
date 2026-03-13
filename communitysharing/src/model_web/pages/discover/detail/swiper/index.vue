<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

/* props */
const props = defineProps<{
  detail: contentDetail | null
}>()

const modules = [Navigation, Pagination, Autoplay]
const progressCircle = ref<number>(0)
const progressContent = ref<string>('')
const autoplayTimeLeft = (s: any, time: number, p: number) => {
    if((props.detail?.imgUris?.length ?? 0) < 1) return;
    progressCircle.value = 1 - p
    progressContent.value = `${Math.ceil(time / 1000)}s`;
}

const onSwiper = (swiper:any) => {
  console.log(swiper);
  // swiper 控制对象
};

const onSlideChange = () => {
  console.log('slide change');
  // 图片切换后
};
</script>

<template>
    <div class="content-swiper">
            <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            :pagination="{ clickable: true }"
            :autoplay="{ delay: 2000, pauseOnMouseEnter: true }"
            :loop="(detail?.imgUris?.length ?? 0 ) > 1"
            navigation
            @swiper="onSwiper" 
            @slideChange="onSlideChange"
            @autoplayTimeLeft="autoplayTimeLeft"
            class="swiper-box"
            >
            <SwiperSlide v-for="item,index in detail?.imgUris" :key="index"><img :src="item"></SwiperSlide>
            </Swiper>
            <!-- 进度条 -->
            <div class="autoplay-progress" v-if="(props.detail?.imgUris?.length ?? 0) > 1">
                <svg viewBox="0 0 48 48" :style="{'--progress': progressCircle}">
                    <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span>{{ progressContent }}</span>
            </div>
    </div>
</template>

<style scoped lang="less">
.content-swiper {
  width: 100%;
  height: 250px;
  position: relative;
}

.swiper-box {
  width: 100%;
  height: 100%;
}

.swiper-box :deep(.swiper-slide) {
  text-align: center;
  font-size: 18px;
  background: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.swiper-box :deep(.swiper-slide img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.autoplay-progress {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 10;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: var(--swiper-theme-color);
}

.autoplay-progress svg {
    --progress: 0;
    position: absolute;
    left: 0;
    top: 0px;
    z-index: 10;
    width: 100%;
    height: 100%;
    stroke-width: 4px;
    stroke: var(--swiper-theme-color);
    fill: none;
    stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
    stroke-dasharray: 125.6;
    transform: rotate(-90deg);
}
</style>