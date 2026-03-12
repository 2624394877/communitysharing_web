<script setup lang="ts">
import { ref, watch,onMounted } from "vue"
import { useRoute } from "vue-router"

import avator from "@/assets/resource/imges/avator.png"

import {
  Collect,
  UnCollect,
  Like,
  UnLike,
  getcontentCount,
  getUserForContentStatus,
  ReBuildContent
} from "@/core/network/service/content"

import { likeOrcollect, followUnfollow } from "@/types/enum"
import { type FollowUnfollow, type LikeOrCollect } from "@/types/enum/enumType"
import { following, unfollowing } from "@/core/network/service/user"

/* props */
const props = defineProps<{
  detail: contentDetail | null
}>()

/* route */
const route = useRoute()

/* 状态 */
const count = ref<contentCount>({
  contentId: "",
  likeTotal: 0,
  collectTotal: 0,
  commentTotal: 0
})

const islike = ref(false)
const iscollect = ref(false)
const isfollowing = ref(false)

/* ---------------- 工具函数 ---------------- */

const notifyError = (msg?: string) => {
  ElNotification.error({
    title: "错误",
    message: msg ?? "操作失败",
    duration: 2500
  })
}

/**
 * 异步进行延时调用
 * Promise对象用法： 对象有两个函数参数 resolve reject
 * resolve() 用于让 Promise结束，表示成功执行
 * reject() 表示执行失败
 * @param ms 延时调用时间
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const rebuildcontent = async(contentId: string, creatorId: string) => {
    try {
        await delay(1000)
        const res = await ReBuildContent(contentId,creatorId)
        if(!res.success) notifyError(res.message)
        console.log(res);
    } catch(error) {
        notifyError('接口异常!')
    }
}

/* ---------------- 获取数据 ---------------- */

const getContentCountOnly = async (contentId: string) => {
  try {
    const res = await getcontentCount(contentId)

    if (!res.success) {
      notifyError(res.message)
      return
    }
    
    count.value.contentId = res.data.contentId
    count.value.likeTotal = res.data.likeTotal
    count.value.collectTotal = res.data.collectTotal
    count.value.commentTotal = res.data.commentTotal

    console.log(count.value);
    

  } catch (e) {
    notifyError()
  }
}

const getUserStatus = async (contentId: string) => {
  try {
    const res = await getUserForContentStatus(contentId)

    if (!res.success) {
      notifyError(res.message)
      return
    }

    islike.value = res.data.like
    iscollect.value = res.data.collect
  } catch (e) {
    notifyError()
  }
}

/* ---------------- 点赞 / 收藏 ---------------- */

const tolike = async (contentId: string, type: LikeOrCollect) => {
  try {
    let res
    console.log(contentId);
    switch (type) {
      case likeOrcollect.like:
        res = await Like(contentId)
        if (res.success) {
          islike.value = true
          count.value.likeTotal++
          rebuildcontent(contentId,props.detail?.creatorId ?? '')
        }
        break

      case likeOrcollect.unlike:
        res = await UnLike(contentId)
        if (res.success) {
          islike.value = false
          count.value.likeTotal--
          rebuildcontent(contentId,props.detail?.creatorId ?? '')
        }
        break

      case likeOrcollect.collect:
        res = await Collect(contentId)
        if (res.success) {
          iscollect.value = true
          count.value.collectTotal++
          rebuildcontent(contentId,props.detail?.creatorId ?? '')
        }
        break

      case likeOrcollect.uncollect:
        res = await UnCollect(contentId)
        if (res.success) {
          iscollect.value = false
          count.value.collectTotal--
          rebuildcontent(contentId,props.detail?.creatorId ?? '')
        }
        break
    }

    if (!res?.success) {
      notifyError(res?.message)
    }

  } catch (e) {
    notifyError()
  }
}

const tofollowing = async(creatorId: string, type: FollowUnfollow) => {
  try {
    let res;
    switch(type) {
      case followUnfollow.following:
        res = await following(creatorId)
        console.log(res)
        if(res.success) isfollowing.value = true
        break
      case followUnfollow.unfollowing:
        res = await unfollowing(creatorId)
        console.log(res)
        if(res.success) isfollowing.value = false
        break
    }

    if (!res?.success) {
      notifyError(res?.message)
    }
    
  } catch(e) {
    notifyError()
  }
}

/* ---------------- 交互 ---------------- */

const like = () => tolike(count.value.contentId, likeOrcollect.like)
const unlike = () => tolike(count.value.contentId, likeOrcollect.unlike)

const collect = () => tolike(count.value.contentId, likeOrcollect.collect)
const uncollect = () => tolike(count.value.contentId, likeOrcollect.uncollect)

const comment = () => {
  console.log("评论", count.value.contentId)
}

const toPersonHome = (id: string) => {
  console.log(`查看 ${id} 主页`)
}

const follow = (creatorId: string) => tofollowing(creatorId, followUnfollow.following)
const unfollow = (creatorId: string) => tofollowing(creatorId, followUnfollow.unfollowing)

/* ---------------- 初始化 ---------------- */

watch(
  () => route.query.contentId,
  (id) => {
    if (!id) return
    
    const contentId = id as string

    getContentCountOnly(contentId)
    getUserStatus(contentId)
  },
  { immediate: true }
)

/* 兜底 */
onMounted(() => {
  const contentId = route.query.contentId as string
  if (!contentId) return

  getContentCountOnly(contentId)
  getUserStatus(contentId)
})
</script>

<template>
    <div class="detail-content">
        <div class="user">
            <span class="info" @click="toPersonHome(detail?.creatorId ?? '')">
                <img :src="detail?.avatar ?? avator" width="60px" height="60px">
                <h3>{{ detail?.creatorName }}</h3>
            </span>
            <span class="follow" @click=" isfollowing? unfollow(detail?.creatorId ?? '') : follow(detail?.creatorId ?? '')">{{ isfollowing? '已关注': '关注' }}</span>
        </div>
        <h2 class="title">{{ detail?.title }}</h2>
        <h4 class="topic"><a># {{ detail?.topicName }}</a></h4>
        <div class="time-act">
            <p class="update-time">更新时间：{{ detail?.updateTime }}</p>
            <div class="act">
              <span class="act-item">
                <v-icon name="bi-hand-thumbs-up" class="ico" scale="1.3" :fill="islike ?'#33CFFF' : '#C5C6C9'" hover animation="float" speed="fast" @click="islike? unlike() : like()"/>
                {{ count.likeTotal }}
              </span>
              <span class="act-item">
                <v-icon name="fa-regular-star" class="ico" scale="1.3" :fill="iscollect ?'#33CFFF' : '#C5C6C9'" hover animation="float" speed="fast" @click="iscollect? uncollect() : collect()"/>
                {{ count.collectTotal }}
              </span>
              <span class="act-item">
                <v-icon name="bi-chat-dots" class="ico" scale="1.3" fill="#C5C6C9" hover animation="float" speed="fast" @click="comment()"/>
                {{ count.commentTotal }}
              </span>
            </div>
        </div>
        <div class="content">
            {{ detail?.content }}
        </div>
    </div>
</template>

<style scoped lang="less">
.detail-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px 0;
    .user {
        width: 100%;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
        .info {
            display: flex;
            align-items: center;
            font: 1em SimSun;
            gap: 0 5px;

            img {
                border-radius: 50%;
                border: 1px solid rgba(0, 145, 255, 0.723);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                outline: #40e2ff 2px;
            }
            img:hover , & h3 {
                cursor: pointer;
            }
        }
        .follow {
            width: 150px;
            height: 50px;
            margin-right: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
            outline: #40e2ff 1px;
            font: 1.2em SimSun;
        }

        .follow:hover {
            background-color: rgba(0, 145, 255, 0.723);
            cursor: pointer;
            animation: 1s;
        }
        .active {
            border: 2px solid rgba(0, 0, 0, 0.15);
        }
    }
    .topic a {
        color: rgba(0, 145, 255, 0.723);
    }
    .topic a:hover {
        cursor: pointer;
    }

    .time-act {
        width: 100%;
        display: flex;
        padding: 0 15px;
        justify-content: space-between;
        .update-time {
            font-size: 13px;
            color: #909399;
            margin-top: 6px;
        }
        .act {
            margin-right: 20px;
            display: flex;
            gap: 0 10px;
            align-items: center;

            .act-item{
                display: flex;
                align-items: center;
                gap: 5px;
                color: #606266;
            }

            .ico:hover {
                cursor: pointer;
            }
        }
    }

    

    .content {
        font-size: 15px;
        line-height: 1.8;
        color: #303133;
        margin-top: 15px;
        white-space: pre-wrap;
    }
}
</style>