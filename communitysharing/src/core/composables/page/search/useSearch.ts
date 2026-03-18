import { ref } from "vue"
import { getSearchContentlist } from "@/core/network/service/content"
import type {userData, searchUserParams} from "@/types/userServer/index"
import { getSearchUserReq } from "@/core/network/service/user"
export function useSearch() {

    // 内容列表
    const contentList = ref<contentList[]>([])

    const userListData = ref<userData[]>([])

    // 分页
    const pageNo = ref(1)

    // 是否允许继续请求
    const hasMore = ref(true)

    // 是否请求中
    const loading = ref(false)

    // 是否为空
    const empty = ref(false)

    // 内容请求参数
    const reqParams = ref<searchParams>({
        keyword: '',
        pageNo: pageNo.value
    })

    const userReqParams = ref<searchUserParams>({
        keyword: '',
        pageNo: pageNo.value
    })

    const isUser = ref<boolean>(false)

    const searchText = ref<string | undefined>()

    /* ------------------ 重置列表 ------------------ */

    const resetList = () => {
        contentList.value = []
        userListData.value = []
        pageNo.value = 1
        hasMore.value = true
        reqParams.value.sort = null;
        reqParams.value.timeRange == null
        reqParams.value.type = null
        isUser.value = false
    }

    /* ------------------ 内容搜索 ------------------ */
    const search = async (params: searchParams) => {
        if (!hasMore.value || loading.value) return

        loading.value = true

        try {
            const res = await getSearchContentlist(params)
            // console.log(res);

            if (!res.success) {
                ElNotification.error({
                    title: '错误',
                    message: res.message,
                    duration: 2000
                })
                return
            }

            const list = res.data || []

            if (pageNo.value === 1 && list.length === 0) {
                empty.value = true
                return
            }

            empty.value = false
            contentList.value.push(...list)

            if (list.length < res.pageSize) {
                hasMore.value = false
            }

        } catch (error: any) {
            ElNotification.error({
                title: "错误",
                message: error?.message || "请求失败",
                duration: 1000
            })
        } finally {
            loading.value = false
        }
    }

    /* ------------------ 用户搜索 ------------------ */
    const searchUser = async (params: searchUserParams) => {
        if (!hasMore.value || loading.value) return

        loading.value = true

        try {
            const res = await getSearchUserReq(params)
            console.log(res);

            if (!res.success) {
                ElNotification.error({
                    title: '错误',
                    message: res.message,
                    duration: 2000
                })
                return
            }

            const list = res.data || []

            if (pageNo.value === 1 && list.length === 0) {
                empty.value = true
                return
            }

            empty.value = false
            userListData.value.push(...list)

            if (list.length < res.pageSize) {
                hasMore.value = false
            }

        } catch (error: any) {
            ElNotification.error({
                title: "错误",
                message: error?.message || "请求失败",
                duration: 1000
            })
        } finally {
            loading.value = false
        }
    }

    /* ------------------ 触发搜索 ------------------ */
    const doSearch = (text: string) => {
        searchText.value = text
        reqParams.value.keyword = text
        resetList()
        search(reqParams.value)
    }


    return {
        contentList,
        userListData,
        pageNo,
        hasMore,
        loading,
        isUser,
        empty,
        reqParams,
        userReqParams,
        searchText,
        resetList,
        search,
        searchUser,
        doSearch
    }
}