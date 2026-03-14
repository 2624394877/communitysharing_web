export interface userData {
    userId: number,
    communitySharingId: string,
    nickname: string,
    avatar: string,
    contentTotal: string,
    fansTotal: string,
    highLightKeyword: string,
    likeTotal: string
}

export interface searchUserParams {
    keyword: string;
    pageNo: number;
}

export interface resData {
    success: boolean;
    errorCode?: string;
    message?: string;
    pageNo: number;
    totalCount: number;
    pageSize: number;
    totalPage: number;
}

interface userResData extends resData {
    data: userData[]
}

export type getSearchUserInfo = (params:searchUserParams) => Promise<userResData>;