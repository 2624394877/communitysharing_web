<script setup lang="ts">
import { reactive, ref } from "vue"
import { searchType } from "@/model_web/pages/discover/usingData/index"
import show from "@/model_web/pages/discover/show/index.vue"
import type { ScrollbarDirection } from "element-plus"
import mitter from "@/core/bus"
import MessageTopic from "@/core/bus/consumer"
import { conditionType } from "@/types/enum"
import { useSearch } from "@/core/composables/page/search/useSearch"
import { useSearchRoute } from "@/core/composables/page/search/useSearchRoute"

// 滚动元素
const scrollRef = ref<HTMLElement | null>(null)

// 当前搜索标签
const searchTab = ref<number>(0)

const { contentList,
    userListData,
    pageNo,
    hasMore,
    loading,
    empty,
    isUser,
    reqParams,
    userReqParams,
    searchText,
    resetList,
    // search,
    searchUser,
    doSearch } = useSearch()

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

const resetUIState = () => {
    resetList()
    mitter.emit(MessageTopic.EMPTY, false)
    mitter.emit(MessageTopic.NOT_HAVE_DATA_MORE, false)
}

/* ------------------ 切换搜索模式 ------------------ */

const selectTab = (id: number,name: string, e: MouseEvent) => {
    const target = e.target as HTMLElement
    const navWidth = scrollRef.value!.offsetWidth

    scrollRef.value!.scrollTo({
        left: target.offsetLeft - (navWidth - target.offsetWidth) / 2,
        behavior: "smooth"
    })

    searchTab.value = id

    resetUIState()
    switch(name) {
        case conditionType.type:
            reqParams.value.type = 0
            break
        case conditionType.sort:
            reqParams.value.sort = 1
            break
        case conditionType.time:
            reqParams.value.timeRange = 0
            break
    }
    doSearch(searchText.value as string)
}

const loadMore = (direction: ScrollbarDirection) => {
  if (direction !== "bottom") return
  if (!hasMore.value || loading.value) return

  pageNo.value++
}
/* ------------------ 条件搜索 ------------------ */
const condition = (type: string,number: number) => {
    // 初始化参数
    resetUIState();
    // 匹配条件
    switch (type) {
        case conditionType.type:
            if (number == 1) {
                doSearch(searchText.value as string)
            } else {
                console.log("搜索用户");
                userReqParams.value.keyword = searchText.value as string
                isUser.value = true
                searchUser(userReqParams.value)
                return;
            }
            break
        case conditionType.sort:
            reqParams.value.sort = number
            console.log(reqParams.value);
            break
        case conditionType.time:
            reqParams.value.timeRange = number
            console.log(reqParams.value);
            break
    }
    // 调用请求
    doSearch(searchText.value as string)
}

useSearchRoute(doSearch)
</script>

<template>
    <div class="web_discover">
        <div class="top_nav" ref="scrollRef"  @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
            <el-dropdown v-for="nav in searchType" :key="nav.id" :disabled="nav.default">
                <span class="cannel" :class="{ active: searchTab === nav.id }"  @click="selectTab(nav.id,nav.name,$event)">{{ nav.name }}</span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="item in nav.children" :key="item.id" @click="condition(item.type,item.id)">{{ item.child }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-scrollbar class="content_body" @end-reached="loadMore" :distance="150">
            <show v-model="contentList" :hasMore="hasMore" :userListData="userListData" :isUser="isUser" :empty="empty"></show>
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
            outline: none;

            &:hover {
                color: white;
                background-color: rgba(0, 179, 255, 0.449);
                cursor: pointer;
            }
            &.active {
                color: white;
                background-color: rgba(0, 179, 255, 0.449);
            }
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
}
</style>