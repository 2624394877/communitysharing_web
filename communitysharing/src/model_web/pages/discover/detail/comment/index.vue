<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { getBatchChildComment, getBatchComment } from '@/core/network/service/comment/index'
import type { ScrollbarDirection } from 'element-plus'
import PublishComment from '@/model_web/components/publicComment/index.vue'
import mitter from '@/core/bus'
/* props */
const props = withDefaults(defineProps<{
  detail: contentDetail | null
}>(), {})

/* 参数 */
const params = ref<reqParams>({
  contentId: '',
  pageNo: 1
})

const childParams = ref<reqChildParams>({
  leve1CommentId: 0,
  pageNo: 1
})

/* 数据 */
const comments = ref<commentsParams[]>([])
const commentTotal = ref<number>(0)

/* 状态 */
const showWho = ref<number>(0)
const hasMore = ref(true)
const childhasMore = ref(true)
const loading = ref(false)

const dialogVisible = ref(false)
const replayCommentId = ref<number>(0)

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

/* ---------------- 子评论请求 ---------------- */

const batchQuery = async (commentId: number) => {

  if (loading.value) return

  /* 如果换评论，需要重置分页 */
  if (showWho.value !== commentId) {
    childParams.value.pageNo = 1
    childhasMore.value = true
  }

  if (!childhasMore.value) return

  loading.value = true
  showWho.value = commentId
  childParams.value.leve1CommentId = commentId

  try {

    const res = await getBatchChildComment(childParams.value)

    if (!res.success) return

    if (res.data.length < res.pageSize) {
      childhasMore.value = false
    }

    const parent = comments.value.find(i => i.commentId === commentId)

    if (parent) {
      parent.children = parent.children || []
      parent.children.push(...res.data)
    }

  } catch (error) {

    ElNotification.error({
      title: '错误!',
      message: '子评论加载失败',
      duration: 2500
    })

  } finally {
    loading.value = false
  }
}

/* ---------------- 主评论请求 ---------------- */

const reqComment = async (params: reqParams) => {

  if (!hasMore.value || loading.value) return

  loading.value = true

  try {

    const res = await getBatchComment(params)

    if (!res.success) {
      ElNotification.error({
        title: "错误！",
        message: res.message,
        duration: 2500
      })
      return
    }
    
    const list = Array.isArray(res.data) ? res.data : []

    if (list.length < res.pageSize) {
      hasMore.value = false
    }else if(list.length === 0) {
        ElNotification.primary({
            title: '重要！',
            message: '当前无评论',
            duration: 2500
        })
        return;
    }

    const fromlist = list.map((item: any) => {

      return {
        ...item,
        children: item.firstReplyComment
          ? [item.firstReplyComment]
          : []
      }

    })

    comments.value.push(...fromlist)

    commentTotal.value = res.totalCount

  } catch (error) {
    console.log(error);
    
    ElNotification.error({
      title: "错误！",
      message: "评论加载失败",
      duration: 2500
    })

    hasMore.value = true

  } finally {
    loading.value = false
  }
}

const comment = (commentId: number) => {
    replayCommentId.value = commentId
    dialogVisible.value = true
    console.log(replayCommentId.value);
}

const getfresh = async() => {
    // console.log('刷新');
    dialogVisible.value = false
    if (!props.detail) return

    /* 重置数据 */
    comments.value = []
    params.value.pageNo = 1
    hasMore.value = true

    params.value.contentId = props.detail.id

    await delay(1000)
    reqComment(params.value)
}

/* ---------------- 滚动加载 ---------------- */

const loadMore = (direction: ScrollbarDirection) => {

  if (direction !== "bottom") return
  if (loading.value) return

  /* 子评论优先加载 */
  if (childhasMore.value && showWho.value) {

    childParams.value.pageNo++
    batchQuery(showWho.value)

  } else if (hasMore.value) {

    params.value.pageNo++
    reqComment(params.value)

  }

}

/* ---------------- 监听详情变化 ---------------- */

watch(
  () => props.detail,
  (detail) => {

    if (!detail) return

    /* 重置数据 */
    comments.value = []
    params.value.pageNo = 1
    hasMore.value = true

    params.value.contentId = detail.id

    reqComment(params.value)

  },
  { immediate: true }
)

onMounted(()=> {
    mitter.on('refresh',getfresh)
})
</script>

<template>
    <el-scrollbar @end-reached="loadMore" :distance="100">
        <div class="detail-comment">
            <div class="comment-divider">
                <span>共 {{ commentTotal }} 条评论</span>
            </div>
            <div class="comment" v-for="item in comments" :key="item.commentId"  v-loading="loading" :data="comments">
                <div class="avator"><img :src="item?.avatar" width="40px" height="40px"></div>
                <div class="comment-content">
                    <div class="txt">
                        <div class="nickname">{{ item?.nickname }}</div>
                        <div class="comment-text">{{ item?.comment }}</div>
                    </div>
                    <div class="image"><img :src="item?.imageUrl" width="120px" height="100px"
                            v-if="item?.imageUrl != ''"></div>
                    <div class="count">
                        <span class="comment-time">{{ item.createTime }}</span>
                        <span class="action-item"><v-icon name="bi-hand-thumbs-up" class="ico" scale="1.3" hover
                                animation="float" speed="fast" />{{ item.likeTotal }}</span>
                        <span class="action-item" @click="comment(item.commentId)"><v-icon name="bi-chat-dots" class="ico" scale="1.3" hover
                                animation="float" speed="fast" />{{ item.childrenCommentTotal }}</span>
                    </div>
                    <!-- 这是子评论 -->
                    <div class="comment" v-for="child in item.children" :key="child.commentId + '_child'">
                        <div class="avator">
                            <img :src="item.firstReplyComment?.avatar" width="40px" height="40px">
                        </div>
                        <div class="comment-content">
                            <div class="txt">
                                <div class="nickname">{{ child.nickname }}</div>
                                <div class="comment-text">{{ child.comment }}</div>
                            </div>
                            <div class="image"><img :src="child.imageUrl" width="120px" height="100px"
                                    v-if="child.imageUrl != undefined"></div>
                            <div v-if="child.replyUserName" class="reply-user">
                                <span class="reply-tag">回复</span>
                                <span class="reply-name">@{{ child.replyUserName }}</span>
                            </div>
                            <div class="count">
                                <span class="comment-time">{{ child.createTime }}</span>
                                <span class="action-item"><v-icon name="bi-hand-thumbs-up" class="ico" scale="1.3" hover
                                        animation="float" speed="fast" />{{ child.likeTotal }}</span>
                                <span class="action-item" @click="comment(child.commentId)"><v-icon name="bi-chat-dots" class="ico" scale="1.3" hover
                                        animation="float" speed="fast" /></span>
                            </div>
                        </div>
                    </div>
                    <p v-if="item.childrenCommentTotal > 1 && item.commentId != showWho" class="reply-toggle"
                        @click="batchQuery(item.commentId)">展开 {{ item.childrenCommentTotal - 1 }} 条回复</p>
                </div>
            </div>
            <div v-if="!hasMore && !childhasMore" class="no-more">
                <span>没有更多数据</span>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" class="custom-transition-dialog" width="30%" :transition="'dialog-custom-object'">
            <template #header>
                <h3 class="log_title" style="">
                    发布评论
                </h3>
            </template>
        <PublishComment :contentId="detail?.id" :replayUserId="replayCommentId" />
        </el-dialog>
    </el-scrollbar>
</template>

<style scoped lang="less">
.detail-comment {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px 0;

    .comment-divider {
        display: flex;
        align-items: center;
        margin: 20px 0;
        color: #909399;
        font-size: 14px;
    }

    .comment-divider::before,
    .comment-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #e4e7ed;
    }

    .comment-divider span {
        padding: 0 15px;
    }

    .comment {
        width: 100%;
        display: flex;
        gap: 0 5px;
        padding: 0 10px;
        box-sizing: border-box;

        .avator {
            border-radius: 50%;
            img {
                border-radius: 50%;
            }
        }

        .comment-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px 0;

            .txt {
                height: 50px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .nickname {
                    font-size: 14px;
                    font-weight: 500;
                    color: #409eff;
                    cursor: pointer;
                }

                .nickname:hover {
                    color: #66b1ff;
                }

                .comment-text {
                    font-size: 14px;
                    line-height: 1.8;
                    color: #303133;
                    margin-top: 6px;
                    white-space: pre-wrap;
                    word-break: break-word;
                    letter-spacing: 0.2px;
                }
            }

            .count {
                display: flex;
                gap: 18px;
                margin-top: 8px;
                font-size: 13px;
                color: #909399;
                align-items: center;

                .comment-time {
                    font-size: 12px;
                    color: #909399;
                }

                .action-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .action-item:hover {
                    color: #409eff;
                }
            }

            .reply-toggle {
                font-size: 13px;
                color: #409eff;
                margin-top: 6px;
                cursor: pointer;
            }
            
            .reply-toggle:hover {
                color: #66b1ff;
            }
        }


        .reply-user {
            display: flex;
            gap: 6px;
            align-items: center;
            font-size: 13px;
            margin-bottom: 4px;
        }

        .reply-tag {
            color: #909399;
        }

        .reply-name {
            color: #409eff;
            cursor: pointer;
        }

        .reply-name:hover {
            text-decoration: underline;
        }
    }
    .no-more {
        text-align: center;
        margin: 20px 0;
        color: #c0c4cc;
        font-size: 13px;
        position: relative;
    }

    .no-more span {
        background: #fff;
        padding: 0 10px;
        position: relative;
        z-index: 1;
    }

    .no-more::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #ebeef5;
    }
}
</style>