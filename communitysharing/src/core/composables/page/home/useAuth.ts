import { ref,computed,watch } from "vue";
import { useAuthStore } from '@/store/auth';
import { OutLogin } from '@/core/network/service/auth'
import { wsService } from '@/core/service/websocket';
import { useRouter } from 'vue-router'
export function useAuthAction(initUserInfo: () => void) {
    const auth = useAuthStore();
    const router = useRouter();
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

    watch(
        () => auth.isLogin,
        (val) => {
            dialogVisible.value = !val;

            if (val) {
                initUserInfo();
            }
        },
        { immediate: true }
    );

    return {
        dialogVisible,
        isLogin,
        toLogin,
        outLogin,
    }
}