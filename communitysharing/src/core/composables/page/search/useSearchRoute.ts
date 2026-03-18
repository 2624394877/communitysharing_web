import { watch } from "vue";
import { useRoute } from "vue-router";
export function useSearchRoute(doSearch: (text: string) => void) {
    const route = useRoute()

    /* ------------------ 监听路由 ------------------ */
    watch(
        () => route.query,
        (newValue) => {
            if (!newValue.text) {
                ElNotification.warning({
                    title: "警告！",
                    message: "搜索内容为空",
                    duration: 1000
                })
                return;
            }
            doSearch(newValue.text as string)
        },
        { immediate: true }
    )
}