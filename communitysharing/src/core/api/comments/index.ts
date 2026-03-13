const commentApi = {
    batch: '/comment/batch/query',
    batchChild: '/comment/batch/query/child',
    publish: '/comment/publish'
} as const 

export default commentApi;