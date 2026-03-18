import { ref,watch } from 'vue';
import { pushRouterActive } from '@/types/enum';
import { useRouter, useRoute } from 'vue-router'
export function useSidebar() {
    const route = useRoute();
    const router = useRouter();
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

    const initActiveBtn = () => {
        const cache = sessionStorage.getItem("actvieBtn")
        if (cache) {
            activeBtn.value = sessionStorage.getItem("actvieBtn") as string;
        }
    }

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

    return {
        activeBtn,
        activebtnForHomeleft,
        initActiveBtn
    }
}