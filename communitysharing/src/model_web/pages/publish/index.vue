<script setup lang="ts">
import { reactive, ref } from "vue"
import { navTabs, cannelTab, topicTab } from "@/model_web/pages/publish/NavTab"
import { CloseBold } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

// 滚动元素
const scrollRef = ref<HTMLElement | null>(null)

// 发布类型
const navTab = ref<number>(0)

const title = ref('')
const textareaInput = ref('')
const cannel = ref<number | string>('')
const topic = ref<number | string>('')
const fileList = ref<UploadFile[]>([])

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

/* ------------------ 切换类型 ------------------ */

const selectTab = (id: number, e: MouseEvent) => {
  const target = e.target as HTMLElement
  const navWidth = scrollRef.value!.offsetWidth

  scrollRef.value!.scrollTo({
    left: target.offsetLeft - (navWidth - target.offsetWidth) / 2,
    behavior: "smooth"
  })

  navTab.value = id
}

// todo 上传文件请求

// todo 发布请求

const setParams = () => {
    let params: publishContent = {
        title: title.value,
        type: navTab.value,
        imgUris: [],
        content: textareaInput.value,
        topicId: topic.value as number,
        channelId: cannel.value as number
    }
    console.log(fileList.value);
    console.log(params);
}
</script>

<template>
    <div class="publish">
        <div class="top_nav" ref="scrollRef"  @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
            <div class="type" :class="{ active: navTab === nav.id }" v-for="nav in navTabs" :key="nav.id" @click="selectTab(nav.id,$event)">{{ nav.name }}</div>
        </div>
       <div class="content-publish">
            <el-scrollbar>
                <div class="input-title">
                    <span>请输入标题</span>
                    <span>
                        <el-input v-model="title" class="title" clearable :clear-icon="CloseBold" placeholder="请输入标题" />
                    </span>
                </div>
                <div class="upload">
                    <el-upload v-model:file-list="fileList" class="upload-demo" drag :auto-upload="false" multiple>
                        <el-icon class="el-icon--upload"><v-icon name="la-cloud-upload-alt-solid" fill="#8DDDFF"
                                scale="1" /></el-icon>
                        <div class="el-upload__text">
                            <div class="tip">上传图片</div>
                            <div class="desc">JPG, PNG, GIF - 必选项</div>
                        </div>
                    </el-upload>
                </div>
                <div class="context">
                    <span>正文</span>
                    <el-input v-model="textareaInput" :autosize="{ minRows: 6, maxRows: 10 }" maxlength="100"
                        type="textarea" show-word-limit size="large" placeholder="请输入正文内容" clearable />
                </div>
                <div class="select-cannel-topic">
                    <el-select v-model="cannel" class="cannel" placeholder="请选择频道" style="width: 43%" clearable>
                        <template #prefix>
                            <span class="select-prefix">频道</span>
                        </template>
                        <el-option v-for="item in cannelTab" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-select v-model="topic" class="topic" placeholder="请选择频道" style="width: 43%" clearable>
                        <template #prefix>
                            <span class="select-prefix">主题</span>
                        </template>
                        <el-option v-for="item in topicTab" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
                <div class="submit" @click="setParams">
                    发布
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<style scoped lang="less">
.publish{
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

        .type {
            width: 100px;
            height: 40px;
            flex-shrink: 0; // flex布局禁止元素在空间不足时被压缩 如果是除0 外的值则表示按比例为元素分摊大小
            margin: 0 10px;
            text-align: center;
            line-height: 40px;
            border-radius: 5px;
            border: 1px solid rgba(0, 179, 255, 0.449);
        }
        .type:hover {
            color: white;
            background-color: rgba(0, 179, 255, 0.449);
            cursor: pointer;
        }
        .type.active {
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

    .content-publish {
        width: 90%;
        height: calc(100vh - 150px);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 10px 0;

        .input-title {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px 0;
            margin-top: 10px;
        }

        .context {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px 0;
        }

        .select-cannel-topic {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .select-prefix {
                color: #909399;
                margin-right: 6px;
            }
        }

        .submit {
            width: 200px;
            height: 40px;
            background-color: #65C2F9;
            margin: 10px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: azure;
            border-radius: 999px;
        }

        .submit:hover {
            cursor: pointer;
            background-color: #003fac;
        }
    }

    .upload {
        width: 100%;
        margin-top: 5px;
    }

    .upload-demo {
        .el-icon--upload {
            margin-bottom: 0;
        }
        
        .tip {
            font-size: 25px;
            color: #000;
        }

        .desc {
            font-size: 20px;
            margin-top: 15px;
            color: #767982;
        }
    }
}
.title :deep(.el-input__wrapper) {
    padding: 5px 3px !important;
}

.title :deep(.el-input__wrapper .el-input__inner) {
    padding: 0px 10px !important;
}

.title :deep(.el-input__wrapper .el-input__suffix) {
    margin-right: 10px;
}

:deep(.el-textarea__inner) {
  resize: none;
}
</style>