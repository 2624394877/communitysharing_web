<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { navTabs } from "@/model_web/pages/discover/usingData/index"
import show from "@/model_web/pages/discover/show/index.vue"
import { getContentsList, getContentsListByChannel } from "@/core/network/service/content"
import { ElNotification } from "element-plus"
import type { ScrollbarDirection } from "element-plus"
import mitter from "@/core/bus"
import MessageTopic from "@/core/bus/consumer"

// 滚动元素
const scrollRef = ref<HTMLElement | null>(null)

// 当前频道
const navTab = ref<number>(0)

// 内容列表
const contentList = ref<contentList[]>([])

// 分页
const pageNo = ref(1)

// 是否允许继续请求
const hasMore = ref(true)

// 是否请求中
const loading = ref(false)

// 是否为空
const empty = ref(false)

/* ------------------ 横向拖拽滚动 ------------------ */

const drag = reactive({
  mouseDown: false,
  startX: 0,
  scrollLeft: 0
})

const startDrag = (e: MouseEvent) => {
  drag.mouseDown = true
  drag.startX = e.pageX
  drag.scrollLeft = scrollRef.value!.scrollLeft
}

const onDrag = (e: MouseEvent) => {
  if (!drag.mouseDown) return
  const walk = e.pageX - drag.startX
  scrollRef.value!.scrollLeft = drag.scrollLeft - walk
}

const stopDrag = () => {
  drag.mouseDown = false
}

/* ------------------ 重置列表 ------------------ */

const resetList = () => {
  contentList.value = []
  pageNo.value = 1
  hasMore.value = true
  mitter.emit(MessageTopic.EMPTY, false)
  mitter.emit(MessageTopic.NOT_HAVE_DATA_MORE, false)
}

/* ------------------ 切换频道 ------------------ */

const selectTab = (id: number, e: MouseEvent) => {
  const target = e.target as HTMLElement
  const navWidth = scrollRef.value!.offsetWidth

  scrollRef.value!.scrollTo({
    left: target.offsetLeft - (navWidth - target.offsetWidth) / 2,
    behavior: "smooth"
  })

  navTab.value = id

  resetList()

  loadContent()
}

/* ------------------ 滚动加载 ------------------ */

const loadMore = (direction: ScrollbarDirection) => {
  if (direction !== "bottom") return
  if (!hasMore.value || loading.value) return

  pageNo.value++

  loadContent()
}

/* ------------------ 获取内容列表 ------------------ */

const loadContent = async () => {

  if (!hasMore.value || loading.value) return

  loading.value = true

  try {

    let res

    if (navTab.value === 0) {
      res = await getContentsList(pageNo.value)
    } else {
      res = await getContentsListByChannel(navTab.value, pageNo.value)
    }

    if (!res.success) {
      ElNotification.error({
        title: '错误',
        message: res.message,
        duration: 2000
      })
      return;
    }

    const list = res.data || []

    // 第一页且没有数据
    if (pageNo.value === 1 && list.length === 0) {
      empty.value = true
      return
    }

    // 有数据就关闭空状态
    empty.value = false

    // 追加数据
    contentList.value.push(...list)

    // 判断是否还有下一页
    if (list.length < res.pageSize) {
      hasMore.value = false
    }

  } catch (error) {

    ElNotification.error({
      title: "失败",
      message: "获取内容列表失败",
      duration: 1000
    })

    console.error(error)

  } finally {
    loading.value = false
  }

}

/* ------------------ 初始化 ------------------ */

onMounted(() => {
  loadContent()
})
</script>

<template>
    <div class="web_discover">
        <div class="top_nav" ref="scrollRef"  @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
            <div class="cannel" :class="{ active: navTab === nav.id }" v-for="nav in navTabs" :key="nav.id" @click="selectTab(nav.id,$event)">{{ nav.name }}</div>
        </div>
        <el-scrollbar class="content_body" @end-reached="loadMore" :distance="150">
            <show v-model="contentList" :hasMore="hasMore" :empty="empty"></show>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="less">
.web_discover{
    width: 100%;
    min-width: 0;
    height: 100%;
    .top_nav {
        width: 100%;
        height: 60px;
        background-color: var(--color-background);
        display: flex;
        align-items: center;
        border-top: 1px solid rgba(0, 179, 255, 0.449);
        border-bottom: 1px solid rgba(0, 179, 255, 0.449);
        overflow-x: auto;
        white-space: nowrap; // 不换行
        gap: 10px; // 行 列间距
        scrollbar-width: none;
        // scroll-behavior: smooth;
        transition: 0.2s;

        .cannel {
            width: 100px;
            height: 40px;
            flex-shrink: 0; // flex布局禁止元素在空间不足时被压缩 如果是除0 外的值则表示按比例为元素分摊大小
            margin: 0 10px;
            text-align: center;
            line-height: 40px;
            border-radius: 5px;
            border: 1px solid rgba(0, 179, 255, 0.449);
        }
        .cannel:hover {
            color: white;
            background-color: rgba(0, 179, 255, 0.449);
            cursor: pointer;
        }
        .cannel.active {
            color: white;
            background-color: rgba(0, 179, 255, 0.449);
        }
    }
    .top_nav::-webkit-scrollbar { // 隐藏滚动条样式
        display: none;
    }
    .top_nav:hover {
        box-shadow: inset 0 1px 6px rgba(0, 179, 255, 0.449);
    }

    .content_body{
        width: 100%;
        height: calc(100% - 60px);
        overflow-y: auto;
    }
    // .content_body::-webkit-scrollbar { // 滚动条样式
    //     display: none;
    // }
}
</style>