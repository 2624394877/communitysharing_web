const contentApi = {
    gethomeContent: '/es/search/content/get',
    getContentsListBychannelId: '/es/search/content/get/channel',
    searchContent: '/es/search/content',
    contentDetail: '/sharing/content/details'
} as const

export default contentApi;