interface commentsParams {
    commentId: number,
    userId: number,
    avatar: string,
    nickname: string,
    comment?: string,
    imageUrl?: string,
    createTime: string,
    likeTotal:number,
    childrenCommentTotal: number,
    heat?: number,
    updateTime?: string
    firstReplyComment: commentsParams,
    children?: commentsParams[],
    replyUserName?:string,
    replyUserId?:number,
    updateTime:string
}

interface resCommentBase {
    success: boolean,
    data: commentsParams[],
    errorCode: number,
    message: string,
    pageNo: number,
    totalCount:number,
    pageSize: number,
    totalPage: number
}

interface reqParams {
    contentId: string,
    pageNo: number
}

interface reqChildParams {
    leve1CommentId: number,
    pageNo: number
}

interface resComment {
    success: boolean,
    message?: string,
    errorCode?: string
}

interface publish {
    contentId: string,
    content: string | null,
    imageUrl: string | null,
    replayCommentId?: number | null
}

type batchComment = (params: reqParams) => Promise<resCommentBase>;

type batchChildComment = (params: reqChildParams) => Promise<resCommentBase>;

type Publish = (params: publish) => Promise<resComment>;