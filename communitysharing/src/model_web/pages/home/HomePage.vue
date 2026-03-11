<script setup lang="ts">
import { ref, computed, watch, reactive, onBeforeMount, onMounted, onUnmounted } from 'vue'
import SearchInput from '@/model_web/components/Search/SearchInput.vue';
import LoginPage from '@/model_web/pages/profile/login/index.vue';
import { ElNotification } from 'element-plus'
import { OutLogin } from '@/core/network/service/auth'
import { useAuthStore } from '@/store/auth';
import { useRoute, useRouter } from 'vue-router'
import { wsService } from '@/core/service/websocket';
import avator from '@/assets/resource/imges/avator.png'
import mitter from '@/core/bus/index'
import consumerMessageConstants from './model/dto/userDto';
import { pushRouterActive } from '@/types/enum';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

/**
 * 用户信息
 */
const userinfo = reactive<UserInfo>({
    communitysharingId: '',
    avatar: '',
    nickname: '',
    introduction: '',
    deleted: false
});

/**
 * 初始化用户信息
 */
const initUserInfo = () => {
    const localUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (localUser?.communitysharingId) {
        Object.assign(userinfo, {
            communitysharingId: localUser.communitysharingId,
            avatar: localUser.avatar ?? avator,
            nickname: localUser.nickname,
            introduction: localUser.introduction,
            deleted: localUser.deleted
        });
    } else if (auth.userInfo) {
        Object.assign(userinfo, {
            communitysharingId: auth.userInfo.communitysharingId,
            avatar: auth.userInfo.avatar ?? avator,
            nickname: auth.userInfo.nickname,
            introduction: auth.userInfo.introduction,
            deleted: auth.userInfo.deleted
        });
    }
};

/**
 * 登录弹窗
 */
const dialogVisible = ref(false);

/**
 * dialog 动画
 */
/* const dialogTransition = computed<DialogTransition>(() => ({
    name: 'dialog-custom-object',
    appear: true,
    mode: 'out-in',
    duration: 500
})); */

/**
 * 是否登录
 */
const isLogin = computed(() => auth.isLogin);

/**
 * 打开登录
 */
const toLogin = () => {
    dialogVisible.value = true;
};

/**
 * 退出登录
 */
const outLogin = async () => {
    try {
        const res = await OutLogin();

        if (!res.success) {
            ElNotification.error({
                title: "错误",
                message: res.message,
                offset: 100
            });
            return;
        }

        ElNotification.success({
            title: "成功",
            message: "登出成功",
            offset: 100
        });

        auth.isLogin = false;
        auth.userInfo = {} as UserInfo;

        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userdetail");

        wsService.close();

        router.push("/");

    } catch (error) {
        console.error(error);
    }
};

/**
 * 按钮激活
 */
const activeBtn = ref<string>(pushRouterActive.discover);

/**
 * 激活首页左侧活动按钮，并调转到对应路由
 * @param page 路由
 */    
const activebtnForHomeleft = (page: string) => {
    router.push(page)
    activeBtn.value = page;
    sessionStorage.setItem("actvieBtn", page);
};

/**
 * 登录状态监听
 */
watch(
    () => auth.isLogin,
    (val) => {
        dialogVisible.value = !val;

        if (val) {
            initUserInfo();

            router.replace('/discover')
        }
    },
    { immediate: true }
);

watch(
    () => route.path,
    (val) => {
        if (val === pushRouterActive.discover) {
            activeBtn.value = pushRouterActive.discover;
        } else if (val === pushRouterActive.publish) {
            activeBtn.value = pushRouterActive.publish;
        }
    }
);

/**
 * mitt 用户信息监听
 */
const userInfoHandler = (data: UserInfo) => {
    console.log("主页接收到消息：", data);

    if (!data) return;

    Object.assign(userinfo, data);
};

/**
 * 子组件数据接收
 */
const getData = (data: UserInfo) => {
    Object.assign(userinfo, data);
};

/**
 * 生命周期
 */
onBeforeMount(() => {
    initUserInfo();
});

onMounted(() => {
    mitter.on(
        consumerMessageConstants.GET_USER_INFO_TOPIC,
        userInfoHandler
    );
    // 在页面挂载后，在应用存储中载入发现和发布的按钮状态
    sessionStorage.getItem("actvieBtn")
    if (sessionStorage.getItem("actvieBtn")) {
        activeBtn.value = sessionStorage.getItem("actvieBtn") as string;
    }
});

onUnmounted(() => {
    mitter.off(
        consumerMessageConstants.GET_USER_INFO_TOPIC,
        userInfoHandler
    );
});
</script>

<template>
    <div class="web_home">
        <header>
            <span class="label_theme">图标和主题</span>
            <span class="search">
                <SearchInput></SearchInput>
            </span>
            <span class="label_nav">
                <a @click="ElNotification.warning({title: '预留扩展', message: '尚未确定开发', offset: 100})" style="cursor: pointer;">扩展功能</a>
                <router-link to="/Personal">个人中心</router-link>
            </span>
        </header>
        <div class="home_body">
            <div class="user_action">
                <el-button class="btn discover" :class="activeBtn===pushRouterActive.discover?'active':''" @click="activebtnForHomeleft(pushRouterActive.discover)" plain>内容浏览</el-button>
                <el-button class="btn publish" :class="activeBtn===pushRouterActive.publish?'active':''" @click="activebtnForHomeleft(pushRouterActive.publish)" plain>发布内容</el-button>
                <el-button type="primary" class="btn toLogin" v-if="!isLogin" @click="toLogin">登录</el-button>
                <div class="toLogin login_user" v-if="isLogin">
                    <div class="userInfo_base">
                        <div class="avator_nikeName">
                            <img :src="userinfo.avatar == null? avator:userinfo.avatar" class="avator" width="65px" height="65px"/>
                            <span class="nikeName_desc">
                                <span class="nikeName">{{ userinfo.nickname }}</span>
                                <span class="desc">{{ userinfo.introduction }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="description_for_web">
                    <span class="title">注意事项：</span>
                    <span class="content">
                        <p>正文1</p>
                        <p>正文2</p>
                        <p>正文3</p>
                    </span>
                </div>
                <el-button type="danger" class="btn toLogin" v-if="isLogin" @click="outLogin">退出登录</el-button>
            </div>
            <div class="content_show">
                <router-view v-if="route.path != `/login/phone`"></router-view>
            </div>
        </div>
        
        <!-- 登录框 -->
         <el-dialog v-model="dialogVisible" class="custom-transition-dialog" width="30%" :transition="'dialog-custom-object'">
            <template #header>
                <h3 class="log_title" style="">
                    {{ auth.startLogin === 1 ? '手机号登录' : auth.startLogin === 2 ? '密码登录' : '邮箱登录' }}
                </h3>
            </template>
            <LoginPage @sendData="getData"></LoginPage>
        </el-dialog>
    </div>
</template>

<style scoped lang="less">
.web_home{
    width: 90%;
    height: 75px;
    margin: 0 auto;
    @media screen and (max-width: 1500px) {
        width: 100%;
    }
    /* 头部 */
    header {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label_theme{
            flex: 1;
            min-width: 0;
            text-align: center;
        }
        .search {
            flex: 3;
            min-width: 0;
        }
        .label_nav {
            flex: 1;
            min-width: 0;
            margin-right: 15px;
            a {
                float: right;
                padding: 10px 28px;
                color: #666;
                font-size: 16px;
                border-radius: 999px;
            }
            a:hover {
                background-color: rgba(225, 219, 219, 0.547);
            }
        }
    }
    /* 主体 */
    .home_body{
        width: 100%;
        height: calc(100vh - 75px);
        display: flex;
        .user_action{
            flex: 1;
            min-width: 0;
            padding-right: 7px;
            display: flex;
            flex-direction: column;
            align-items: center; /* 水平居中 */
            .btn{
                width: 90%;
                height: 50px;
                margin: 10px 0px;
                border-radius: 999px;
            }
            /* 按钮激活时的样式（持久化） */
            .active {
                color: #409eff;
                background-color: #ffffff;
                border-color: #409eff;
            }
            .toLogin {
                margin: 30px 0px;
            }
            .login_user {
                width: 90%;
                border-radius: 15px;
                .userInfo_base {
                    width: 100%;
                    padding: 0px 15px;
                    border-radius: 15px;
                    .avator_nikeName {
                        display: flex;
                        align-items: center;
                        .avator {
                            border: #44b7fa 1px solid;
                            border-radius: 50%;
                        }
                    }
                    .nikeName_desc {
                        margin-left: 10px;
                        span {
                            display: block; /* 将行内元素转换为块级元素 */
                        }
                        .desc {
                            font-size: 12px;
                            color: #aca7a7;
                        }
                    }
                }
            }
            .login_user:hover {
                .nikeName,.desc {
                    color: white;
                }
            }
            .description_for_web {
                width: 90%;
                padding: 10px 15px;
                border-radius: 15px;
                border: 1px solid rgb(137, 182, 189);
                .title {
                    font-size: 16px;
                    font-weight: 600;
                }
                .content {
                    font-size: 14px;
                }
            }
            .description_for_web:hover,.login_user:hover {
                cursor: pointer;
                background-color: rgba(93, 164, 235,0.5);
            }
        }
        .content_show{
            min-width: 0;
            flex: 4;
            // background-color: rgb(137, 182, 189);
        }
    }

    /* 登录框样式 */
    /* Slide Animation */
    .dialog-slide-enter-active,
    .dialog-slide-leave-active,
    .dialog-slide-enter-active .el-dialog,
    .dialog-slide-leave-active .el-dialog {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .dialog-slide-enter-from,
    .dialog-slide-leave-to {
    opacity: 0;
    }

    .dialog-slide-enter-from .el-dialog,
    .dialog-slide-leave-to .el-dialog {
    transform: translateY(-100px);
    opacity: 0;
    }
    /* header */
    .log_title {
        width: 100%;
        text-align: center;
        margin: 25px 0px 0px 0px;
    }

    /* .dialog-custom-object-enter-active,
    .dialog-custom-object-leave-active {
    transition: all 0.5s ease;
    }

    .dialog-custom-object-enter-from {
    opacity: 0;
    transform: scale(0.9);
    }

    .dialog-custom-object-leave-to {
    opacity: 0;
    transform: scale(0.9);
    } */
}
</style>