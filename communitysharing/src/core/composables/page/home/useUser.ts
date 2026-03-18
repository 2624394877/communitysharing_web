import { reactive } from 'vue';
import { useAuthStore } from '@/store/auth';
import avator from '@/assets/resource/imges/avator.png'
export function useUser() {
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
     * 子组件数据接收
     */
    const getData = (data: UserInfo) => {
        Object.assign(userinfo, data);
    };

    return{
        userinfo,
        initUserInfo,
        getData
    }
}