<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { uploadImg } from '@/core/network/service/file'
import { publishComment } from '@/core/network/service/comment'
import mitter from '@/core/bus'

const props = defineProps<{
  contentId?: string
  replayUserId?: number | null
}>()


/* ---------------- 状态 ---------------- */

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])
const textarea = ref('')
const disabled = ref(false)

/* ---------------- 图片操作 ---------------- */

const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter(i => i.uid !== file.uid)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url || URL.createObjectURL(file.raw!)
  dialogVisible.value = true
}

/* ---------------- 文件校验 ---------------- */

const checkImage = (file: File) => {
  const isImage = file.type === 'image/png' || file.type === 'image/jpeg'

  if (!isImage) {
    ElNotification.error({
      title: '上传错误',
      message: '请上传 png / jpg 图片',
      offset: 100
    })
  }

  return isImage
}

/* ---------------- 上传图片 ---------------- */

const uploadFile = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadImg(formData)

    if (!res.success) {
      ElNotification.error({
        title: '图片上传失败!',
        message: res.message
      })
      return null
    }

    return res.data.url
  } catch {
    ElNotification.error({
      title: '图片上传失败!',
      message: '请重新上传'
    })
    return null
  }
}

/* ---------------- 发布评论 ---------------- */

const publish = async (params: publish) => {
  try {
    const res = await publishComment(params)

    if (!res.success) {
      ElNotification.error({
        title: '评论发布失败!',
        message: res.message
      })
      return false
    }

    return true
  } catch {
    ElNotification.error({
      title: '评论发布失败!',
      message: '请重试'
    })
    return false
  }
}

/* ---------------- 提交评论 ---------------- */

const uploadComment = async () => {

  const file = fileList.value[0]?.raw
  let imageUrl: string | null = null

  // 上传图片
  if (file) {
    if (!checkImage(file)) {
      fileList.value = []
      return
    }

    imageUrl = await uploadFile(file)
  }

  // 没有内容也没有图片
  if (!imageUrl && !textarea.value.trim()) {
    ElNotification.warning({
      title: '提示',
      message: '评论内容不能为空'
    })
    return
  }

  const req: publish = {
    contentId: props.contentId ?? '',
    imageUrl,
    content: textarea.value || null,
    replayCommentId: props.replayUserId ?? null
  }

  const success = await publish(req)

  if (!success) return

  ElNotification.success({
    title: '发布成功!'
  })

  // 清空输入
  textarea.value = ''
  fileList.value = []

  // 刷新页面
  mitter.emit('refresh',true)
  // router.go(0)
}
</script>
<template>
    <div class="comment-box">
       <div class="upload">
            <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" v-model:file-list="fileList">
                <el-icon>
                    <Plus />
                </el-icon>

                <template #file="{ file }">
                    <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <el-icon><zoom-in /></el-icon>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </span>
                        </span>
                    </div>
                </template>
            </el-upload>
            <el-dialog v-model="dialogVisible" width="250px">
                <img :src="dialogImageUrl" alt="Preview Image" width="200px" height="200px" />
            </el-dialog>
        </div>
        <div class="context">
            <el-input v-model="textarea" class="ml-4" maxlength="30" style="width: 100%" placeholder="请输入"
                show-word-limit word-limit-position="outside" type="textarea" />
        </div>
        <div class="submit-comment">
            <el-button type="primary" round @click="uploadComment">发布</el-button>
        </div>
    </div>
</template>

<style scoped lang="less">
.comment-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px 0;

    .submit-comment {
        width: 100px;
        margin: 0 auto;

        .el-button {
            width: 100%;
        }
    }
}
</style>