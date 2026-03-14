const contentApi = {
    gethomeContent: '/es/search/content/get',
    getContentsListBychannelId: '/es/search/content/get/channel',
    searchContent: '/es/search/content',
    contentDetail: '/sharing/content/details',
    contentIslikeOrCollect: '/sharing/content/judge/likeAndCollect',
    contentCount: '/count/content/data/id',
    like: '/sharing/content/like',
    unlike: '/sharing/content/unlike',
    collect: '/sharing/content/collect',
    uncollect: '/sharing/content/uncollect',
    rebuildContent: '/es/search/content/doc/rebuild',
    publish: '/sharing/content/publish'
} as const

export default contentApi;