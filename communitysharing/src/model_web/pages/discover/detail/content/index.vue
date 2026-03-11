<script setup lang="ts">
import { watch } from 'vue';
import avator from '@/assets/resource/imges/avator.png'

/* props */
const props = withDefaults(defineProps<{
  detail: contentDetail | null,
}>(), {})

const toPersonHome = (id:string) => {
    console.log(`查看 ${id} 主页`);
    
}

const following = (id:string) => {
    console.log(`关注 ${id}`);
    
}

watch(
  () => props.detail,
  (detail) => {
    if (!detail) return
    // console.log(detail,props.data);
  },
  { immediate: true }
)
</script>

<template>
    <div class="detail-content">
        <div class="user">
            <span class="info" @click="toPersonHome(detail?.creatorId ?? '')">
                <img :src="detail?.avatar ?? avator" width="60px" height="60px">
                <h3>{{ detail?.creatorName }}</h3>
            </span>
            <span class="follow" @click="following(detail?.creatorId ?? '')">关注</span>
        </div>
        <h2 class="title">{{ detail?.title }}</h2>
        <h4 class="topic"><a># {{ detail?.topicName }}</a></h4>
        <div class="time-act">
            <p class="update-time">更新时间：{{ detail?.updateTime }}</p>
            <div class="act">
                <v-icon name="bi-hand-thumbs-up" class="ico" scale="1.3" hover animation="float" speed="fast"/>{{  }}
                <v-icon name="fa-regular-star" class="ico" scale="1.3" hover animation="float" speed="fast"/> {{  }}
                <v-icon name="bi-chat-dots" class="ico" scale="1.3" hover animation="float" speed="fast"/>{{  }}
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