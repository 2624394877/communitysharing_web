<script setup lang="ts">
import testImage from "@/assets/resource/imges/avator.png"
import avator from "@/assets/resource/imges/backgroundImg.png"
import type {userData} from "@/types/userServer/index"
import { useRouter } from "vue-router";
// import { watch } from "vue"
// 内容列表（父组件 v-model 传入）
const contentList = defineModel<contentList[]>({
  default: () => [],
})

// 状态
const props = withDefaults(defineProps<{
    hasMore: boolean
    empty: boolean
    isUser?: boolean
    userListData?: userData[]
}>(),{
    isUser:false,
    userListData:()=>[]
})

const router = useRouter();

/* ------------------ 进入详情 ------------------ */

const enterDetail = (contentId: string,likeTotal: string,collectTotal:string,commentTotal:string) => {
  console.log("内容id:", contentId)
  router.push({ path: '/detail/content',query:{contentId,likeTotal,collectTotal,commentTotal} })
}
</script>

<template>
    <div class="dicover-show">
        <template v-if="!isUser">
            <el-card class="content-card" shadow="hover" v-for="item in contentList" :key="item.contentId" @click="enterDetail(item.contentId,item.likeTotal,item.collectTotal ?? '',item.commentTotal ?? '')">
                <img :src="item.cover ? item.cover : testImage" class="card-img" v-if="item.cover? true:false"/>
                <!-- <video :src="testVideo" style="width: 100%;display: block;"></video> -->
                <v-icon name="ri-video-line" class="video-svg" scale="1.1" hover style="z-index: 999;" v-if="item.type === 1"/>
                <div class="card-content">
                    <div class="content-title">{{ item.title }}</div>
                    <div class="creator-info">
                        <span class="avator"><img :src="item.avatar? item.avatar:avator" width="50px" height="50px"></span>
                        <span class="nickname">{{ item.nickname }}</span>
                        <div class="info-item">
                            <span class="label"><v-icon name="bi-hand-thumbs-up" scale="1.1" animation="float" speed="slow" fill="#779ef2" hover/></span>
                            <span class="num">{{ item.likeTotal }}</span>
                        </div>
                    </div>
                </div>
                <template #footer>{{ item.updateTime }}</template>
            </el-card>
        </template>
        <template v-if="isUser">
            <el-card class="user-card" shadow="hover" v-for="item in props.userListData">
                <div class="user-info">
                    <span class="avator"><img :src="item.avatar ? item.avatar : avator" width="50px" height="50px"></span>
                    <span class="nickname">{{ item.nickname }}</span>
                </div>
                <div class="user-count">
                    <span class="count">
                        <span class="label"><v-icon name="bi-heart" scale="1" animation="float" speed="slow" fill="#779ef2"
                                hover /></span>
                        <span class="num">{{ item.fansTotal }}</span>
                    </span>
                    <span class="count">
                        <span class="label"><v-icon name="md-create-outlined" scale="1" animation="float" speed="slow" fill="#779ef2"
                                hover /></span>
                        <span class="num">{{ item.contentTotal }}</span>
                    </span>
                    <span class="count">
                        <span class="label"><v-icon name="bi-hand-thumbs-up" scale="1.1" animation="float" speed="slow" fill="#779ef2"
                                hover/></span>
                        <span class="num">{{ item.likeTotal }}</span>
                    </span>
                </div>
            </el-card>
        </template>
    </div>
    <div class="no-more" v-show="!hasMore && contentList.length">没有数据了</div>
    <!-- 空状态内容-->
    <el-empty v-if="empty" class="empty" description="没有任何内容">
    </el-empty>
</template>

<style scoped lang="less">
.dicover-show{ // 网格布局
    width: 100%;
    background-color: var(--color-background);

    display: grid;
    grid-template-columns: repeat(auto-fill, 250px); // 定义网格列数，自动填满剩余空间
    gap: 15px;

    justify-content: center;

    .content-card{
        width: 250px;
        margin-top: 5px;
        padding: 0px;
        flex-shrink: 0;
        position: relative;

        .creator-info {
            display: flex;
            align-items: center;
            text-align: center;
            gap: 10px;
            margin-top: 10px;

            .nickname {
                width: 80px;
                white-space: inherit; // 文本换行
            }

            .info-item{
                float: right;
                display: flex;
                flex-direction: column;
                align-items: center;

                .label{
                    font-size: 12px;
                    color: #888;
                }

                .num{
                    font-weight: bold;
                    font-size: 14px;
                }
            }

            // .user-card {
            //     display: flex;
            //     justify-content: space-around;
            // }

            // .count {
            //     display: flex;
            //     flex-direction: column;
            //     align-items: center;
            // }

            // .user-card .count:not(:last-child)::after {
            //     content: "";
            //     position: absolute;
            //     right: 0;
            //     top: 20%;
            //     height: 60%;
            //     width: 1px;
            //     background: rgba(10,118,206,0.5);
            // }
        }

        .video-svg {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10;
        }

        .card-img {
            width: 100%;
            height: 220px;     /* 固定高度 */
            object-fit: cover; /* 保持比例裁剪 */
            object-position: center; /* 居中 */
            display: block;
        }
    }
    .content-card:hover {
        cursor: pointer;
    }

    .empty {
        width: 100%;
        margin: 0 auto;
    }

    .user-card {
        width: 250px;
        margin-top: 5px;
        padding: 0px;
        flex-shrink: 0; // 不压缩空间
        color: white;
        position: relative;
        overflow: hidden; // 溢出部分不显示


       .user-info {
           width: 100%;
           margin: 0 auto;
           display: flex;
           align-items: center;
           gap: 20px;
           margin-bottom: 10px;

           .avator {
            border-radius: 999%;
            border: 1px solid rgb(0, 162, 255);

                img {
                    border-radius: 999%;
                }
           }
       }

        .user-count {
            width: 100%;
            display: flex;
            justify-content: space-around;

            .count {
                display: flex;
                flex-direction: column;
                text-align: center;
            }
        }
    }
    .user-card::before{
        content: "";
        position: absolute;
        inset: 0;

        background: url("@/assets/resource/imges/backgroundImg.png") center/cover no-repeat;
        background-size: cover;
        background-position: center;

        /* 
         filter: blur(4px) brightness(0.8);  
            blur(4px) 模糊效果，模糊参数半径
            brightness(0.8) 控制 亮度。 1为原始亮度
        */
        filter: blur(2px) brightness(0.8);
        transform: scale(1.1); // 按比例放大元素 按照元素本身的大小划比例
        z-index: 0;
    }

    .user-card *{
        position: relative;
        z-index: 1;
    }
    
    .label:hover {
        cursor: pointer;
    }
}
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  color: #999;
  font-size: 14px;
}

.no-more::before,
.no-more::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e5e5;
  margin: 0 12px;
}
</style>

<!-- <style scoped lang="less">
.dicover-show{ // 普通的flex布局
    width: 100%;
    background-color: var(--color-background);
    display: flex;
    gap: 10px;
    flex-wrap: wrap; // flex布局子元素换行

    .content-card{
        width: 250px;
        margin-top: 5px;
        padding: 0px;
        flex-shrink: 0;

        .creator-info {
            height: 60px;
            display: flex;
            align-items: center;
            text-align: center;
            gap: 10px;
            margin-top: 10px;

            .nickname {
                width: 80px;
                white-space: inherit; // 文本换行
            }
        }
    }
}
</style> -->