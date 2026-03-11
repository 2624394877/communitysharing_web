<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { getContentDetail } from '@/core/network/service/content'
import { useRoute } from 'vue-router'
import { getCurrentTime2miunte } from '@/utils/dateUtils'
import music from '@/model_web/pages/discover/detail/music/index.vue'
import content from '@/model_web/pages/discover/detail/content/index.vue'
import comment from '@/model_web/pages/discover/detail/comment/index.vue'
/* ---------------- 常量数据 ---------------- */
const constant = {
    video: 'video',
    audio: 'audio'
} as const



// const data = reactive<count>({
//     likeTotal: '',
//     collectTotal: '',
//     commentTotal: ''
// })

/* ---------------- 基础数据 ---------------- */

const route = useRoute()
const drawer = ref(false)

const detail = ref<contentDetail | null>(null)
const videoUrl = ref('')

const videoRef = ref<HTMLVideoElement>()
const videoWrapper = ref<HTMLElement>()

const progressRef = ref<HTMLElement>()
const volumeProgressRef = ref<HTMLElement>()

const fileType = reactive({
    type: ''
})
/* ---------------- 播放状态 ---------------- */

const videoDuration = ref(0)
const currentTime = ref(0)

const isPlay = ref(true)
const isFullscreen = ref(true)

/* ---------------- 拖动状态 ---------------- */

const isDragging = ref(false)
const isDraggingVolume = ref(false)

/* ---------------- 音量 ---------------- */

const volume = ref(0)

/* ---------------- 计算属性 ---------------- */

const progressPercent = computed(() => {
  if (!videoDuration.value) return 0
  return (currentTime.value / videoDuration.value) * 100
})

/* ---------------- 视频控制 ---------------- */

const play = () => {
  videoRef.value?.play()
  isPlay.value = false
}

const pause = () => {
  videoRef.value?.pause()
  isPlay.value = true
}

/* ---------------- 视频元数据 ---------------- */

const getMeta = () => {
  videoDuration.value = videoRef.value?.duration ?? 0
}

const updateTime = () => {
  currentTime.value = videoRef.value?.currentTime ?? 0
}

/* ---------------- 进度条 ---------------- */

const startProgressDrag = () => {
  isDragging.value = true
}

const seek = (e: MouseEvent) => {
  updateProgress(e)
}

const updateProgress = (e: MouseEvent) => {
  if (!videoRef.value || !progressRef.value) return

  const rect = progressRef.value.getBoundingClientRect()

  const percent = Math.min(
    Math.max((e.clientX - rect.left) / rect.width, 0),
    1
  )

  videoRef.value.currentTime = percent * videoDuration.value
}

const dragging = (e: MouseEvent) => {
  if (!isDragging.value) return
  updateProgress(e)
}

const endDrag = () => {
  isDragging.value = false
}

/* ---------------- 音量 ---------------- */

const startVolumeDrag = () => {
  isDraggingVolume.value = true
}

const seekVolume = (e: MouseEvent) => {
  updateVolume(e)
}

const updateVolume = (e: MouseEvent) => {
  if (!videoRef.value || !volumeProgressRef.value) return

  const rect = volumeProgressRef.value.getBoundingClientRect()

  const percent = Math.min(
    Math.max((e.clientX - rect.left) / rect.width, 0),
    1
  )

  volume.value = percent * 100
  videoRef.value.volume = percent
}

const draggingVolume = (e: MouseEvent) => {
  if (!isDraggingVolume.value) return
  updateVolume(e)
}

const endVolumeDrag = () => {
  isDraggingVolume.value = false
}

/* ---------------- 全屏 ---------------- */

const fullscreen = () => {
  videoWrapper.value?.requestFullscreen()
}

const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

const handleFullscreen = () => {
  isFullscreen.value = !document.fullscreenElement
}

/* ---------------- 视频列表 ---------------- */

const playVideo = (url: string) => {
  if (url === videoUrl.value) {
    ElNotification.warning({
      title: '提示',
      message: '已经是当前播放视频'
    })
    return
  }

  videoUrl.value = url
}

/* ---------------- 请求内容 ---------------- */

const file = async (url: string) => {
    const res = await fetch(url, { method: "HEAD" })

    const type = res.headers.get("content-type")
    if (!type) return

    const mainType = type.split('/')[0]

    // fileType.value = type.split('/')[0] ?? '' | ??:如果左边是 null 或 undefined → 返回右边,否则 → 返回左边
    if (mainType) {
        fileType.type = mainType
    }
}

const fetchContentDetail = async (id: string) => {
  try {
    const res = await getContentDetail({ id })
    // console.log(res.data);
    
    if (!res.success) {
      ElNotification.error({
        title: '错误',
        message: res.message
      })
      return
    }

    res.data.id = id
    
    detail.value = res.data
    videoUrl.value = res.data.videoUris?.[0] || ''
    file(res.data.videoUris?.[0] || '')
  } catch (error) {

    ElNotification.error({
      title: '错误',
      message: '请求失败'
    })

  }
}

/* ---------------- 全局鼠标事件 ---------------- */

const handleMouseMove = (e: MouseEvent) => {
  dragging(e)
  draggingVolume(e)
}

const handleMouseUp = () => {
  endDrag()
  endVolumeDrag()
}

const togglePlay = () => {

    if (isDragging.value) return   // 防止拖动触发

    const video = videoRef.value
    if (!video) return

    if (video.paused) {
        video.play()
        isPlay.value = false
    } else {
        video.pause();
        isPlay.value = true
    }
}

/* ---------------- 生命周期 ---------------- */

onMounted(async () => {

//   const query = route.query;
    
  const contentId = route.query.contentId as string

//   data.likeTotal = query.likeTotal as string
//   data.collectTotal = query.collectTotal as string
//   data.commentTotal = query.commentTotal as string

  if (!contentId) {
    ElNotification.warning({
      title: '警告',
      message: '请求参数异常'
    })
    return
  }

  await fetchContentDetail(contentId)

  // 获取计数
  

  nextTick(() => {
    if (videoRef.value) {
      volume.value = videoRef.value.volume * 100
    }
  })

  document.addEventListener("mousemove", handleMouseMove)
  document.addEventListener("mouseup", handleMouseUp)
  document.addEventListener("fullscreenchange", handleFullscreen)

})

onUnmounted(() => {

  document.removeEventListener("mousemove", handleMouseMove)
  document.removeEventListener("mouseup", handleMouseUp)
  document.removeEventListener("fullscreenchange", handleFullscreen)

})
</script>

<template>
    <div class="detail-container">

        <div class="multimedia">
            <!-- 视频 -->
            <el-scrollbar :distance="150">
                <div class="video-wrapper" ref="videoWrapper" v-if="fileType.type === constant.video">
                    <!-- 视频 -->
                    <video :key="videoUrl" :src="videoUrl" class="video-player" @loadedmetadata="getMeta"
                        @timeupdate="updateTime" ref="videoRef" @click="togglePlay"></video>
                    <!-- 进度条 -->
                    <div class="progress">
                        <div class="progress-current" ref="progressRef" @click="seek" @mousedown="startProgressDrag">
                            <div class="progress-strip" :style="{ width: progressPercent + '%' }">
                                <div class="progress-dot"></div>
                            </div>
                        </div>
                    </div>
                    <v-icon name="bi-play-circle" class="play" scale="1.3" hover animation="float" speed="fast" @click="play" v-if="isPlay"/>
                    <v-icon name="bi-pause-circle" class="pause" scale="1.3" hover animation="float" speed="fast" @click="pause" v-if="!isPlay"/>
                    <v-icon name="bi-arrows-fullscreen" class="fullscreen" scale="1.3" hover animation="float" speed="fast" @click="fullscreen" v-if="isFullscreen "/>
                    <v-icon name="bi-fullscreen-exit" class="fullscreen" scale="1.3" hover animation="float" speed="fast" @click="exitFullscreen" v-if="!isFullscreen "/>
                    <!-- 音量 -->
                    <div class="video-volume">
                        <div class="volume-progress" ref="volumeProgressRef">
                            <div class="volume-progress-current" @click="seekVolume" @mousedown="startVolumeDrag">
                                <div class="volume-progress-strip" :style="{ width: volume + '%' }">
                                    <div class="volume-progress-dot"></div>
                                </div>
                            </div>
                        </div>
                        <v-icon name="bi-volume-mute" class="video-volume-mute" scale="1.3" hover animation="float" speed="fast" v-if="volume === 0"/>
                        <v-icon name="hi-volume-up" class="video-volume-up" scale="1.3" hover animation="float" speed="fast"  v-else-if="volume < 80"/>
                        <v-icon name="bi-volume-up-fill" class="video-volume-medium" scale="1.3" hover animation="float" speed="fast" v-else/>
                    </div>
                    <span>{{ getCurrentTime2miunte(currentTime) }} / {{ getCurrentTime2miunte(videoDuration) }}</span>
                    <!-- 播放列表 -->
                    <div class="multimedia-list">
                        <v-icon name="bi-list-ul" class="play-list" scale="1.3" hover animation="float" speed="fast"
                            @click="drawer = true" />
                        <el-drawer v-model="drawer" direction="rtl" resizable size="20%">
                            <template #default>
                                <ul class="list" style="color: black;">
                                    <li class="item" :class="{ active: videoUrl === item }"
                                        v-for="(item, index) in detail?.videoUris" :key="index"
                                        @click="playVideo(item)">
                                        视频{{ index + 1 }}
                                    </li>
                                </ul>
                            </template>
                        </el-drawer>
                    </div>
                </div>
                <music v-if="detail?.type === 1 && fileType.type === constant.audio" :detail="fileType.type === constant.audio? detail:null"></music>
                <content :detail="detail"></content>
            </el-scrollbar>
        </div>
        <div class="comment">
            <comment :detail="detail"></comment>
        </div>
    </div>
</template>

<style scoped lang="less">
.video-avg() {
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: absolute;
    bottom: 50px;
}

.video-avg-fulled {
    width: 50px;
    height: 50px;
}

.detail-container {
    width: 100%;
    height: calc(100vh - 80px); // css计算需要有空格，作为分隔符
    display: flex;
    overflow: hidden;

    /* 左侧浏览区 */
    .multimedia {
        flex: 1;
        background: #fff;
        padding: 20px;
        overflow-y: auto;

        .video-wrapper {
            position: relative;
            width: 100%;

            .progress {
                width: 100%;
                height: 5px;
                position: absolute;
                bottom: 30px;
                left: 0;
                padding: 0 15px;

                .progress-current {
                    width: 100%;
                    height: 100%;
                    border-radius: 999px;
                    background-color: rgba(255, 255, 255, 0.349);

                    .progress-strip {
                        position: relative;
                        height: 100%;
                        background-color: #40e2ff;

                        .progress-dot {
                            position: absolute;
                            left: 100%;
                            /* 关键 */
                            top: 50%;
                            transform: translate(-50%, -50%);
                            width: 10px;
                            height: 10px;
                            border-radius: 999%;
                            background-color: #409eff;
                        }
                    }
                }
            }

            .progress:hover {
                height: 7px;
                cursor: pointer;

                .progress-dot {
                    width: 12px;
                    height: 12px;
                }

                .progress-dot:hover {
                    width: 15px;
                    height: 15px;
                }
            }

            .multimedia-list {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
            }

            .play {
                .video-avg();
                right: 100px;
            }

            .pause {
                .video-avg();
                right: 100px;
            }

            .fullscreen {
                .video-avg();
                right: 50px;
            }

            .video-volume {
                .volume-progress {
                    width: 100px;
                    height: 5px;
                    position: absolute;
                    bottom: 65px;
                    left: 95px;
                    // padding: 0 15px;

                    .volume-progress-current {
                        width: 100%;
                        height: 100%;
                        border-radius: 999px;
                        background-color: rgba(255, 255, 255, 0.349);

                        .volume-progress-strip {
                            position: relative;
                            height: 100%;
                            background-color: #40e2ff;

                            .volume-progress-dot {
                                position: absolute;
                                left: 100%;
                                /* 关键 */
                                top: 50%;
                                transform: translate(-50%, -50%);
                                width: 10px;
                                height: 10px;
                                border-radius: 999%;
                                background-color: #409eff;
                            }
                        }
                    }
                }
                .volume-progress:hover {
                    cursor: pointer
                }
            }

            .video-volume-up,
            .video-volume-mute,
            .video-volume-medium {
                .video-avg();
                // color: white
                left: 45px;
            }
        }

        .video-player {
            width: 100%;
            // max-height:60vh;
            border-radius: 8px;
        }

        /* 全屏容器 */
        :deep(.video-wrapper:fullscreen) {
            width: 100vw;
            height: 100vh;
            background: black;
        }

        /* 全屏视频 */
        :deep(.video-wrapper:fullscreen .video-player) {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 0;
        }

        /* 按钮 */
        &-list {
            position: absolute;
            top: 10px;
            right: 10px;

            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;

            .list {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;

                .item {
                    width: 100%;
                    height: 50px;
                    margin: 6px 0;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    cursor: pointer;

                    border-radius: 6px;

                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

                    transition: all .2s;
                }

                .item:hover {
                    background: #409eff;
                    color: white;
                    transform: translateX(3px);
                }

                .active {
                    background: #409eff;
                    color: white;
                }
            }
        }
    }

    /* 右侧评论区 */
    .comment {
        width: 420px;
        border-left: 1px solid #eee;
        background: #fafafa;
        overflow-y: auto;
    }
}
</style>