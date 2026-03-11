<script setup lang="ts">
import { ref,onBeforeMount, watch } from 'vue';
import { useAuthStore } from '@/store/auth'
import img from '@/assets/resource/imges/avator.png';
import backgroundImg from '@/assets/resource/imges/backgroundImg.png';
import { loadUser } from '@/core/common/util'
import { updateUser, getUserInfo } from '@/core/network/service/auth'
import { ElNotification,ElLoading } from 'element-plus';
import type { UploadProps } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import emitter from '@/core/bus/index'
import consumerMessageConstants from '@/model_web/pages/home/model/dto/userDto';
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const activeName = ref<string>('query')
const userinfo = ref<AuthDetail>({
    avatar: '',
    backgroundImg: '',
    communitysharingId: '',
    createTime: '',
    deleted: false,
    email: '',
    introduction: '',
    nickname: '',
    phone: '',
    sex: 1
});
const copyUserinfo = ref<AuthDetail>({
    avatar: '',
    backgroundImg: '',
    communitysharingId: '',
    createTime: '',
    deleted: false,
    email: '',
    introduction: '',
    nickname: '',
    phone: '',
    sex: 1
});
const avator = ref<File | null>(null); // 头像
const background_img = ref<File | null>(null); // 背景图
// 获取用户信息
const Info = (Name:string) => {
    activeName.value = Name;
    if (auth.userdetail.communitysharingId != undefined) {
        userinfo.value = auth.userdetail; 
        copyUserinfo.value = loadUser(userinfo.value);
    }
    router.push('/Personal/info');
}
onBeforeMount(()=> { // 组件挂载前更新auth，第二次获取(保底)
    const info = sessionStorage.getItem('userdetail');
    let Info: AuthDetail;
    if (info) {
        Info = JSON.parse(info);
        auth.setUserDetail(Info);
    }
})
watch(() => auth.userdetail, (newValue) => { // 监听用户信息更新，并深拷贝一份用于修改
    if (newValue.communitysharingId != undefined){
        userinfo.value = newValue;
        copyUserinfo.value = loadUser(userinfo.value);
    }
})
// 修改信息
let isUpdate = ref(false);
const onUpload = (file: any,name:string) => { // 检查对应的文件是否为属于用户信息字段
    if (isUpdate.value) {
        if (name === 'avator') {
            avator.value = file.raw;
            isUpdate.value = true;
        }else if (name === 'backgroundImg') {
            background_img.value = file.raw;
            isUpdate.value = true;
        }else {
            ElNotification.warning({
                title: '上传错误',
                message: '检查到错误的类型',
                offset: 100
            });
            isUpdate.value = false;
        }
    } else {
        ElNotification.warning({
            title: '上传错误',
            message: '检查文件格式或大小',
            offset: 100
        });
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => { // 检查文件类型
    if (rawFile.type === 'image/png' || rawFile.type === 'image/jpeg') {
        avator.value = rawFile;
        isUpdate.value = true;
        return false;
    } else {
        ElNotification.error({
            title: '上传错误',
            message: '请上传图片文件',
            offset: 100
        });
        isUpdate.value = false;
        return false;
    }
}
const getUser = async() => { // 获取用户信息，成功后更新auth和sessionStorage
    try {
        const res = await getUserInfo();
        if (res.success) {
            sessionStorage.setItem('userdetail', JSON.stringify(res.data));
            auth.setUserDetail(res.data);
            // 拿到了数据之后更新lcoalStorage中的基础数据
            const userinfoStr:string|null = localStorage.getItem('userInfo');
            if (userinfoStr) {
                const userinfo:UserInfo = JSON.parse(userinfoStr);
                userinfo.communitysharingId = res.data.communitysharingId;
                userinfo.nickname = res.data.nickname;
                userinfo.avatar = res.data.avatar;
                userinfo.deleted = res.data.deleted;
                userinfo.introduction = res.data.introduction;
                localStorage.setItem('userInfo', JSON.stringify(userinfo));
                loadUser(res.data);
            }
            // todo 发送消息通知
            emitter.emit(consumerMessageConstants.GET_USER_INFO_TOPIC,res.data)

            ElNotification.success({
                title: '获取成功',
                message: '信息获取成功',
                offset: 100
            });
        } else {
            ElNotification.warning({
                title: '警告',
                message: '信息获取失败，尝试重新登录',
                offset: 100
            })
        }
    } catch (error) {
        console.log(error);
    } 
}

const updateUserInfo = async() => { // 修改信息
    // copyUserinfo.value转换为form-data
    const formData = new FormData();
    Object.entries(copyUserinfo.value).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === 'communitysharingId' || key === 'avatar' || key === 'backgroundImg') return;
        // 其他类型（number / boolean / string）
        else {
            formData.append(key, value as any);
        }
    })
    if (avator.value) {
        formData.append('avator', avator.value);
    }
    if (background_img.value) {
        formData.append('backgroundImg', background_img.value);
    }

    try {
        const res = await updateUser(formData)
        if (res.success) {
            ElNotification.success({
                title: '修改成功',
                message: '修改成功',
                offset: 100
            });
            // 调用获取用户信息
            getUser();
        } else {
            ElNotification.error({
                title: '修改失败',
                message: res.message,
            })
        }
    }catch (error) {
        console.log(error);
        ElNotification.error({
            title: '错误',
            message: '需要先登录',
            offset: 100
        });
    }
}
onBeforeMount(async () => { // 在组件挂载前获取用户信息，第一次获取
    if (sessionStorage.getItem('userdetail') === null) {
        const loading = ElLoading.service({
            lock: true,
            text: '正在加载数据...',
            background: 'rgba(0, 0, 0, 0.7)',
            fullscreen: true,
        });
        setTimeout(() => {
            getUser();
            loading.close()
        }, 2000)
    }else {
        const data: AuthDetail = JSON.parse(sessionStorage.getItem('userdetail') || '{}')
        if (data.communitysharingId) {
            auth.setUserDetail(data);
        } else {
            ElNotification.warning({
                title: '警告',
                message: '需要刷新一下页面',
                offset: 100
            });
        }
    }
})
const update = (name:string) => { // 修改信息的路由
    activeName.value = name;
    if (['password', 'email', 'phone'].includes(activeName.value)) { 
        router.push(`/Personal/info/${name}`);
    }else {
        router.push(`/Personal/info`);
    }
}
onBeforeMount(async()=>{ // 默认路由为基本信息
    if (route.path != '/Personal/info') {
        router.push('/Personal/info');
    }
})
const permissionQue = () => {
    ElNotification.warning({
        title: '权限查询',
        message: '用户端不开放权限查询功能',
        offset: 100
    });
}
</script>

<template>
    <div class="info">
        <div class="tab">
            <div class="list">
                <ul>
                    <li @click="Info('query')" :class="activeName === 'query'? 'cur': ''"><a>基本信息</a></li>
                    <li @click="update('modify')" :class="activeName === 'modify'? 'cur': ''"><a>修改信息</a></li>
                    <li @click="permissionQue" :class="activeName === 'permission'? 'cur':''"><a>权限查询</a></li>
                    <li @click="update('password')" :class="activeName === 'password'? 'cur':''"><a>重置密码</a></li>
                    <li @click="update('email')" :class="activeName === 'email'? 'cur':''"><a>更换邮箱</a></li>
                    <li @click="update('phone')" :class="activeName === 'phone'? 'cur':''"><a>更换手机号</a></li>
                </ul>
            </div>
        </div>
        <div class="listCon">
            <div v-if="activeName === 'query'? true: false">
                <p><span>UID:</span>{{ userinfo.communitysharingId }}</p>
                <p><span>昵称:</span>{{ userinfo.nickname }}</p>
                <p><span>性别:</span>{{ userinfo.sex === 1? '男':'女' }}</p>
                <p class="avator">
                    <span>头像:</span><img :src="userinfo.avatar === undefined ? img:userinfo.avatar" width="50px" height="50px">
                    {{ userinfo.avatar === undefined? ' <默认头像>':''  }}
                </p>
                <p><span>简介:</span>{{ userinfo.introduction }}</p>
                <p class="backgroundImg">
                    <span>背景图:</span><img :src="userinfo.backgroundImg === undefined ? backgroundImg:userinfo.backgroundImg" width="100px" height="50px">
                    {{ userinfo.backgroundImg === undefined ? ' <默认背景图>':''  }}
                </p>
                <p><span>手机号:</span>{{ userinfo.phone }}</p>
                <p><span>邮箱:</span>{{ userinfo.email }}</p>
                <p><span>创建时间:</span>{{ userinfo.createTime }}</p>
            </div>
            <div v-if="activeName === 'modify'? true: false">
                <p>
                    <span>UID:</span>
                    {{ userinfo.communitysharingId }}
                </p>
                <p>
                    <span>昵称:</span>
                    <input type="text" v-model="copyUserinfo.nickname"></input>
                </p>
                <p>
                    <span>性别:</span>
                    <el-button :class="{ active: copyUserinfo.sex === 1 }" @click="copyUserinfo.sex = 1" circle>男</el-button>
                    <el-button :class="{ active: copyUserinfo.sex === 0 }" @click="copyUserinfo.sex = 0" circle>女</el-button>
                </p>
                <p class="avator">
                    <span>头像:</span>
                    <el-upload class="avatar-box" :before-upload="beforeAvatarUpload" :on-change="(file)=>onUpload(file,'avator')" style="width: 50px;height: 50px;">
                        <img :src="userinfo.avatar === undefined ? img:userinfo.avatar" class="avator-img">
                        <div class="mask">
                            <span style="padding: 0px;cursor: pointer;">更换头像</span>
                        </div>
                    </el-upload>
                </p>
                <p>
                    <span>简介:</span>
                    <input type="text" v-model="copyUserinfo.introduction"></input>
                </p>
                <p class="backgroundImg">
                    <span>背景图:</span>
                    <el-upload class="backgroundImg-box" :before-upload="beforeAvatarUpload" :on-change="(file)=>onUpload(file,'backgroundImg')" style="width: 100px;height: 50px;">
                        <img :src="userinfo.backgroundImg === undefined ? backgroundImg:userinfo.backgroundImg" width="100px" height="50px">
                        <div class="backgroundImg-mask">
                            <span style="padding: 10px;cursor: pointer;text-align: center;">更换背景图</span>
                        </div>
                    </el-upload>
                </p>
                <p>
                    <span>手机号:</span>
                    {{ userinfo.phone }}
                </p>
                <p>
                    <span>邮箱:</span>
                    {{ userinfo.email }}
                </p>
                <p>
                    <span>创建时间:</span>
                    {{ copyUserinfo.createTime }}
                </p>
                <el-button type="primary" @click="updateUserInfo" class="save" plain>保存</el-button>
            </div>
            <div v-if="activeName === 'permission'? true: false" >权限查询</div>
            <div v-if="['password', 'email', 'phone'].includes(activeName)" >
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.info{
    width: 100%;
    height: 100%;
    .tab {
        margin: 5px 0;
        ul {
            border-right: 1px #e2e2e2 solid;
            display: inline-block;

            li {
                float: left;
                border-left: 1px #e2e2e2 solid;
                border-bottom: 1px #e2e2e2 solid;
                border-top: 1px #e2e2e2 solid;
                line-height: 36px;
                padding: 0 20px;
                cursor: pointer;
            }
        }
    }

    .listCon {
        div {
            line-height: 50px;
            p {
                word-wrap: break-word;
                word-break: break-word;
                span {
                    width: 140px;
                    display: inline-block;
                    text-align: right;
                    padding-right: 15px;
                }
                input {
                    width: 300px;
                    border: none;
                    background: transparent;
                    outline: none;
                    padding: 10px;
                    border-radius: 999px;
                }
                input:focus {
                    border: 1px solid #3577CE;
                    background-color: #e2e2e2;
                    caret-color: #3577CE;
                }
            }
            .avator {
                display: flex;
                align-items: center;
                img {
                    border-radius: 999%;
                }
                .avatar-box {
                    position: relative;
                    border-radius: 90%;
                    overflow: hidden; /*超出部分隐藏*/
                    cursor: pointer;

                    .avator-img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover; /*图片填充方式：填充整个容器*/
                        cursor: pointer;
                    }

                    .mask {
                        position: absolute;
                        inset: 0;
                        background-color: rgba(0, 0, 0, 0.45);
                        color: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        opacity: 0;
                        transition: opacity 0.25s;
                        font-size: 12px;
                        cursor: pointer;

                        .avator-upload {
                            position: absolute;
                            inset: 0; /*设置元素绝对定位，并使其填充父元素*/
                            opacity: 0;
                            cursor: pointer;
                        }
                    }
                }
                
                .avatar-box:hover .mask {
                    opacity: 1;
                }
            }
        }

        .backgroundImg {
            display: flex;
            align-items: center;

            img {
                border-radius: 10px;
            }

            .backgroundImg-box {
                position: relative;
                border-radius: 10px;
                overflow: hidden; /*超出部分隐藏*/
                cursor: pointer;
            }

            .backgroundImg-img{
                /* width: 100%;
                height: 100%; */
                object-fit: cover; /*图片填充方式：填充整个容器*/
                cursor: pointer;
            }

            .backgroundImg-mask {
                position: absolute;
                inset: 0;
                background-color: rgba(122, 193, 232, 0.45);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.25s;
                font-size: 12px;
                cursor: pointer;
            }

            .backgroundImg-box:hover .backgroundImg-mask {
                opacity: 1;
            }
        }

        .save {
            width: 60%;
            height: 50px;
            margin: 10px 30px;
            border-radius: 999px;
        }
    }
}
.cur {
    background: #3577CE;
    
    a {
        color: #fff;
    }
}

/* 按钮激活时的样式（持久化） */
.active {
    color: #409eff;
    background-color: #ffffff;
    border-color: #409eff;
}

</style>