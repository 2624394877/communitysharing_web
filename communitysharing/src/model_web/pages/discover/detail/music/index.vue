<script setup lang="ts">
import { getCurrentTime2miunte } from '@/utils/dateUtils'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

/* props */
const props = withDefaults(defineProps<{
  detail: contentDetail | null
}>(), {})

/* 视频数据 */
const videoUrls = ref<string[]>([])
const videoUrlsIndex = ref(0)
const videoUrl = ref('')

/* 音频 */
const audioRef = ref<HTMLAudioElement | null>(null)
const audioDuration = ref(0)
const currentTime = ref(0)

/* 进度条 */
const musicProgressRef = ref<HTMLElement | null>(null)
const musicVolumeProgressRef = ref<HTMLElement | null>(null)

const isDragging = ref(false)
const isDraggingVolume = ref(false)

const volume = ref<number>(0) 

/* 播放状态 */
const isPlay = ref(true)
const drawer = ref<boolean>(false)

/* ---------------- 计算属性 ---------------- */

const musicProgressPercent = computed(() => {
  if (!audioDuration.value) return 0
  return (currentTime.value / audioDuration.value) * 100
})

/* ---------------- 音频事件 ---------------- */

const getMeta = () => {
  audioDuration.value = audioRef.value?.duration ?? 0
}

const updateTime = () => {
  if (isDragging.value) return
  currentTime.value = audioRef.value?.currentTime ?? 0
}

/* ---------------- 视频切换 ---------------- */

const playVideo = (item: string, index: number) => {
  if (videoUrlsIndex.value === index) {
    ElNotification.error({
      title: "错误！",
      message: "已经是这个了！",
      duration: 2500
    })
    return
  }

  videoUrl.value = item
  videoUrlsIndex.value = index
}

const switchVideo = (index: number, msg: string) => {
  if (index < 0 || index >= videoUrls.value.length) {
    ElNotification.error({
      title: "错误！",
      message: msg,
      duration: 2500
    })
    return
  }

  videoUrl.value = videoUrls.value[index] ?? ''
  videoUrlsIndex.value = index
}

/* ---------------- 播放控制 ---------------- */

const play = async() => {
  try {
    await audioRef.value?.play()
    isPlay.value = false
  } catch (e) {
    console.warn("播放被中断", e)
  }
}

const pause = () => {
  audioRef.value?.pause()
  isPlay.value = true
}

const pre = () => {
  switchVideo(videoUrlsIndex.value - 1, "这就是第一个！")
}

const next = () => {
  switchVideo(videoUrlsIndex.value + 1, "这就是最后一个！")
}

/* ---------------- 进度计算 ---------------- */

const calcProgress = (e: MouseEvent) => {
  const rect = musicProgressRef.value?.getBoundingClientRect()
  if (!rect || !audioDuration.value) return

  const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
  const time = percent * audioDuration.value

  if (audioRef.value) {
    audioRef.value.currentTime = time
  }

  currentTime.value = time
}

const calcProgressVolume = (e: MouseEvent) => {
  const rect = musicVolumeProgressRef.value?.getBoundingClientRect()
  if (!rect || !audioRef.value) return

  const percent = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1)

  volume.value = percent * 100
  audioRef.value.volume = percent
}

/* ---------------- 拖动逻辑 ---------------- */

const startDrag = () => {
  isDragging.value = true
  pause()
}

const startDragVolume = () => {
  isDraggingVolume.value = true
}

const dragging = (e: MouseEvent) => {
  if (!isDragging.value) return
  calcProgress(e)
}

const draggingVolume = (e: MouseEvent) => {
  if (!isDraggingVolume.value) return
  calcProgressVolume(e)
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  play()
}

const endDragVolume = () => {
  isDraggingVolume.value = false
}

/* ---------------- 点击跳转 ---------------- */

const seek = (e: MouseEvent) => {
  calcProgress(e)
}

const ToSeek = (e: MouseEvent) => {
  calcProgressVolume(e)
}

const mute = () => {
  if (!audioRef.value) return
  audioRef.value.volume = 0
  volume.value = 0
}

const up = () => {
  if (!audioRef.value) return
  audioRef.value.volume = 1
  volume.value = 100
}

/* ---------------- 鼠标事件 ---------------- */

const handleMouseMove = (e: MouseEvent) => {
  if (isDraggingVolume.value) {
    draggingVolume(e)
  } else {
    dragging(e)
  }
}

const handleMouseUp = () => {
  if (isDraggingVolume.value) {
    endDragVolume()
  } else {
    endDrag()
  }
}

watch(()=>videoUrl.value,(newValue => {
  if (!newValue || !audioRef.value) return
  pause()
  // console.log(newValue);
  if(newValue != '') nextTick(()=>{
    play()
  })
}))

/* ---------------- 生命周期 ---------------- */

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  if (audioRef.value) {
    volume.value = audioRef.value.volume * 100
  }

  if (!props.detail) return

  const urls = props.detail.videoUris ?? []
  if (!urls.length) return

  videoUrls.value = urls
  videoUrlsIndex.value = 0
  videoUrl.value = urls[0] ?? ''
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
    <div class="detail-music">
        <div class="music-swipper">
            <audio :src="videoUrl" ref="audioRef" @loadedmetadata="getMeta" @timeupdate="updateTime"></audio>
            <div class="music-player">
                <div class="controls">
                    <v-icon name="md-reorder-round" class="order control" scale="1.5" animation="float" hover speed="fast" @click="drawer = true"/>
                    <div class="multimedia-list">
                      <el-drawer v-model="drawer" direction="rtl" resizable size="20%">
                        <template #default>
                          <ul class="list" style="color: black;">
                            <li class="item" :class="{ active: videoUrlsIndex === index }" v-for="(item, index) in videoUrls" :key="index"
                              @click="playVideo(item,index)">
                              音频{{ index + 1 }}
                            </li>
                          </ul>
                        </template>
                      </el-drawer>
                    </div>
                    <v-icon name="md-skipprevious-round" class="pre control" @click="pre" scale="2" animation="float" hover speed="fast"/>
                    <span class="player">
                        <v-icon name="co-media-play" class="play control" scale="2" animation="float" hover speed="fast" @click="play" v-if="isPlay"/>
                        <v-icon name="la-pause-solid" class="pause control" scale="2" animation="float" hover speed="fast" @click="pause" v-if="!isPlay"/>
                    </span>
                    <v-icon name="md-skipnext-round" class="next control" @click="next" scale="2" animation="float" hover speed="fast"/>
                    <!-- popper-class: ? -->
                    <el-dropdown  popper-class="volume-dropdown" placement="bottom" role="tooltip" :hide-on-click="false">
                      <span class="volume">
                        <v-icon name="bi-volume-mute" class="mute control" @click="up" scale="2" animation="float" hover speed="fast"
                          v-if="volume === 0" />
                        <v-icon name="bi-volume-up" class="up control" @click="mute" scale="2" animation="float" hover speed="fast"
                          v-else />
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item disabled>
                            <span class="volume">
                              <v-icon name="bi-volume-mute" class="mute control" scale="1.5" v-if="volume === 0" />
                              <v-icon name="bi-volume-up" class="up control" scale="1.5" v-else />
                            </span>
                          </el-dropdown-item>
                          <el-dropdown-item class="item">
                            <div class="volume-progress">
                              <div class="volume-progress-current" ref="musicVolumeProgressRef" @click="ToSeek" @mousedown="startDragVolume">
                                <div class="volume-progress-strip" :style="{ height: volume + '%' }">
                                  <div class="volume-progress-dot"></div>
                                </div>
                              </div>
                            </div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                </div>
                <div class="audio-progress">
                    <div class="progress-current" ref="musicProgressRef" @mousedown="startDrag" @click="seek">
                        <div class="progress-strip" :style="{ width: musicProgressPercent + '%' }">
                            <div class="progress-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
            <span class="time">{{ getCurrentTime2miunte(currentTime) }} / {{ getCurrentTime2miunte(audioDuration) }}</span>
        </div>
    </div>
</template>

<style scoped lang="less">
.detail-music {
  width: 100%;
  height: 200px;

  .music-swipper {
    position: relative;

    .music-swipper() {
      border-radius: 15px;
    }

    width: 90%;
    height: 90%;
    background-color: rgba(0, 195, 255, 0.8);
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
    .music-swipper();
    /* box-shadow: 水平偏移 垂直偏移 模糊半径 扩散半径 颜色; */
    box-shadow: 1px 2px 6px 2px rgba(0, 0, 0, 0.15);

    .music-player {
      width: 100%;
      height: 100%;
      background-color: aliceblue;
      .music-swipper();
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      /* gap: 行间距 列间距; */
      gap: 20px 0px;

      .controls {
        width: 300px;
        height: 60px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-shrink: 0;
        // gap: 0px 15px;

        @media (max-width: 1031px) {
          width: 250px;
        }
      }

      .control {
        outline: none;
      }

      .control:hover {
        cursor: pointer;
      }

      .audio-progress {
        width: 100%;
        height: 9px;
        margin-bottom: 30px;
        padding: 0 15px;
        align-items: center; // 垂直居中

        .progress-current {
          width: 100%;
          height: 3px;
          background-color: #b8b4b485;
          margin: auto 0;
          border-radius: 999px;

          .progress-strip {
            height: 100%;
            width: 0%;
            background-color: rgba(0, 195, 255, 0.8);
            position: relative;

            .progress-dot {
              width: 10px;
              height: 10px;
              background-color: rgba(0, 195, 255, 0.8);
              border-radius: 50%;
              position: absolute;
              right: 0px;
              top: 50%;
              transform: translate(50%, -50%);
              opacity: 0;
            }
          }
        }

        &:hover {
          cursor: pointer;

          .progress-dot {
            opacity: 1 !important;
          }
        }
      }

      .volume {
        outline: none;
      }

      /* 按钮 */
      .multimedia-list {

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

    .time {
      position: absolute;
      bottom: 65px;
      left: 30px;
    }
  }

}

.volume-dropdown .el-dropdown-menu__item .volume-progress {
  width: 5px !important;
  height: 100px !important;
  border-radius: 999px;

  .volume-progress-current {
    width: 100%;
    height: 100%;
    background-color: rgba(133, 135, 135, 0.644);

    .volume-progress-strip {
      width: 100%;
      height: 0%;
      position: relative;
      background-color: rgba(0, 195, 255, 0.8);

      .volume-progress-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        bottom: 0px;
        right: 50%;
        transform: translate(50%, 50%); // x y
        background-color: rgba(0, 195, 255, 1);
      }
    }
  }
}
</style>