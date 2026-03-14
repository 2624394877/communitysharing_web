<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { navTabs, cannelTab,topicTab } from "@/model_web/pages/publish/NavTab"
import type { UploadFile, UploadFiles } from "element-plus"
import { uploading } from "@/core/network/service/file"
import { Publishes } from "@/core/network/service/content"
import type { FileType } from "@/types/enum/enumType"
import { fileType } from "@/types/enum"
import { CloseBold } from '@element-plus/icons-vue'

/* ---------------- 状态 ---------------- */

const scrollRef = ref<HTMLElement | null>(null)

const navTab = ref(0)
const filetype = ref<FileType | undefined>('image')
const fileList = ref<UploadFile[]>([])
const published = ref(false)

const map = new Map<number, FileType>()

type UriKey = 'imgUris' | 'videoUris' | 'fileUris'

const uriMap: Record<FileType, UriKey | undefined> = {
    image: 'imgUris',
    video: 'videoUris',
    audio: 'videoUris',
    doc: 'fileUris',
    text: undefined,
    link: undefined
}

/* ---------------- 发布参数 ---------------- */

const params = reactive<publishContent>({
  title: '',
  type: 0,
  imgUris: null,
  videoUris: null,
  fileUris: null,
  linkUris: null,
  content: '',
  topicId: 0,
  channelId: 0
})

/* ---------------- 通知 ---------------- */

const notifyWarning = (msg: string) => {
  ElNotification.warning({
    title: "警告",
    message: msg,
    duration: 2500
  })
}

/* ---------------- 横向拖动 ---------------- */

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

/* ---------------- tab切换 ---------------- */

const resetFiles = () => {
  fileList.value = []
  params.fileUris = null
  params.imgUris = null
  params.videoUris = null
  params.linkUris = null
}

const selectTab = (id: number, type: number, e: MouseEvent) => {

  const target = e.target as HTMLElement
  const navWidth = scrollRef.value!.offsetWidth

  scrollRef.value!.scrollTo({
    left: target.offsetLeft - (navWidth - target.offsetWidth) / 2,
    behavior: "smooth"
  })

  navTab.value = id
  params.type = type

  filetype.value = map.get(id)

  resetFiles()
}

/* ---------------- 文件校验 ---------------- */

const validateFile = (type: FileType, file: UploadFile) => {

  const raw = file.raw
  if (!raw) return false

  const sizeOk = raw.size < 100 * 1024 * 1024

  if (!sizeOk) return false

  switch (type) {

    case fileType.image:
      return raw.type === 'image/png' || raw.type === 'image/jpeg'

    case fileType.video:
      return raw.type.startsWith('video/')

    case fileType.audio:
      return raw.type.startsWith('audio/')

    case fileType.doc:
      const name = file.name.toLowerCase()

      return [
        'text/plain',
        'text/markdown',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(raw.type) ||
        name.endsWith('.md') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx') ||
        name.endsWith('.pdf')

    default:
      return false
  }
}

/* ---------------- 上传 ---------------- */

const upload = async (data: FormData) => {

  try {

    const res = await uploading(data)

    if (!res.success) {

      ElNotification.error({
        title: "文件上传失败",
        message: res.message,
        duration: 2500
      })

      return
    }

    ElNotification.success({
      title: "文件上传成功",
      duration: 2000
    })

    return res.data.url

  } catch {

    ElNotification.error({
      title: "文件上传失败",
      message: "请重新上传",
      duration: 2500
    })
  }
}

/* ---------------- 添加文件url ---------------- */

const appendUri = (type: FileType, url: string) => {

  const key = uriMap[type]

  if (!key) return

  if (!params[key]) {
    params[key] = []
  }

  ;(params[key] as string[]).push(url)

}

/* ---------------- 文件处理 ---------------- */

const calibration = async (
  type: FileType | undefined,
  file: UploadFile,
  files: UploadFiles
) => {

  if (!type) {
    notifyWarning("文件类型错误")
    return
  }

  if (!validateFile(type, file)) {

    notifyWarning("文件格式错误或超过100MB")

    files.splice(files.indexOf(file), 1)

    return
  }

  const form = new FormData()
  form.append("file", file.raw!)

  const url = await upload(form)

  if (!url) {
    files.splice(files.indexOf(file), 1)
    return
  }

  appendUri(type, url)
}

/* ---------------- 发布 ---------------- */

const publish = async () => {

  if (filetype.value !== fileType.text && filetype.value !== fileType.link) {

    if (fileList.value.length === 0) {
      notifyWarning("至少需要一个文件")
      return
    }

  }

  published.value = true

  try {

    const res = await Publishes(params)

    if (!res.success) {

      notifyWarning(res.message ?? '')

      return
    }

    ElNotification.success({
      title: "发布成功",
      duration: 2500
    })

    resetFiles()

  } catch {

    ElNotification.error({
      title: "发布失败",
      duration: 2500
    })

  } finally {

    published.value = false

  }

}

/* ---------------- 初始化 ---------------- */

onMounted(() => {

  navTabs.forEach(item => {
    map.set(item.id, item.filetype)
  })

})
</script>

<template>
    <div class="publish" v-loading="published">

        <!-- 顶部类型导航 -->
        <div class="top_nav" ref="scrollRef" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
            @mouseleave="stopDrag">
            <div class="type" v-for="nav in navTabs" :key="nav.id" :class="{ active: navTab === nav.id }"
                @click="selectTab(nav.id, nav.type, $event)">
                {{ nav.name }}
            </div>
        </div>

        <!-- 发布内容 -->
        <div class="content-publish">

            <el-scrollbar>

                <!-- 标题 -->
                <div class="input-title">
                    <span>请输入标题</span>

                    <el-input v-model="params.title" class="title" clearable :clear-icon="CloseBold"
                        placeholder="请输入标题" />
                </div>

                <!-- 上传区域 -->
                <div class="upload">

                    <el-upload v-if="filetype !== fileType.text && filetype !== fileType.link"
                        v-model:file-list="fileList" class="upload-demo" drag multiple :auto-upload="false"
                        :on-change="(file, files) => calibration(filetype, file, files)">

                        <el-icon class="el-icon--upload">
                            <v-icon name="la-cloud-upload-alt-solid" fill="#8DDDFF" scale="1" />
                        </el-icon>

                        <div class="el-upload__text">

                            <div class="tip">

                                <span v-if="filetype === fileType.image">上传图片</span>
                                <span v-else-if="filetype === fileType.video">上传视频</span>
                                <span v-else-if="filetype === fileType.audio">上传音频</span>
                                <span v-else-if="filetype === fileType.doc">上传文档</span>

                            </div>

                            <div class="desc">

                                <span v-if="filetype === fileType.image">
                                    JPG / PNG / GIF
                                </span>

                                <span v-else-if="filetype === fileType.video">
                                    MP4 / WEBM / 3GP
                                </span>

                                <span v-else-if="filetype === fileType.audio">
                                    MP3 / WAV / AAC
                                </span>

                                <span v-else-if="filetype === fileType.doc">
                                    DOCX / MARKDOWN / PDF
                                </span>

                            </div>

                        </div>

                    </el-upload>

                </div>

                <!-- 正文 -->
                <div class="context">

                    <span>正文</span>

                    <el-input v-model="params.content" type="textarea" size="large" maxlength="100" show-word-limit
                        :autosize="{ minRows: 6, maxRows: 10 }" clearable :placeholder="filetype === fileType.link
                                ? '请输入链接或正文内容'
                                : '请输入正文内容'
                            " />

                </div>

                <!-- 频道 + 主题 -->
                <div class="select-cannel-topic">

                    <el-select v-model="params.channelId" class="cannel" placeholder="请选择频道" clearable
                        style="width: 43%">
                        <template #prefix>
                            <span class="select-prefix">频道</span>
                        </template>

                        <el-option v-for="item in cannelTab" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>

                    <el-select v-model="params.topicId" class="topic" placeholder="请选择主题" clearable style="width: 43%">
                        <template #prefix>
                            <span class="select-prefix">主题</span>
                        </template>

                        <el-option v-for="item in topicTab" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>

                </div>

                <!-- 发布按钮 -->
                <div class="submit" @click="publish">
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