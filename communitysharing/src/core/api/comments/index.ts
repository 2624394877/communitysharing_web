const commentApi = {
    batch: '/comment/batch/query',
    batchChild: '/comment/batch/query/child',
    publish: '/comment/publish',
    like: '/comment/like',
    unlike: '/comment/unlike',
    del: '/comment/delete'
} as const 

export default commentApi;