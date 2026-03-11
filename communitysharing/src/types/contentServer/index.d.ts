interface contentList {
    contentId: string;
    cover?: string;
    title: string;
    avatar?:string;
    nickname?: string;
    tpoicId?: number;
    topic: string;
    channelId: number;
    type: number;
    likeTotal: string;
    collectTotal?: string;
    commentTotal?: string;
    createTime?: string;
    updateTime?: string;
}

interface responseData {
    success: boolean;
    errorCode?: string;
    message?: string;
    pageNo: number;
    totalCount: number;
    pageSize: number;
    totalPage: number;
}

interface contentListData extends responseData {
    data: contentList[];
}

interface searchParams {
    keyword: string;
    pageNo: number;
    type?: number | null;
    sort?: number | null;
    timeRange?: number | null;
}


interface contentDetail {
    id: string,
    title: string,
    creatorId: string,
    creatorName: string,
    avatar?: string,
    type: number,
    topicId: nunmber,
    topicName: string,
    videoUris?: string[],
    imgUris?: string[],
    linkUris?: string[],
    fileUris?: string[],
    updateTime: string,
    visible: boolean,
    content?: string
}

interface resDetailData{
    data: contentDetail,
    success: boolean,
    message?: string,
    errorCode?: string
}

interface contentDetailreq {
    id: string
}

type getContentListData = (pageNo:number) => Promise<contentListData>; // 这是一个函数类型，返回一个Promise对象

type getContentListbyChannel = (channelId:number,pageNo:number) => Promise<contentListData>; // 这是一个函数类型，返回一个Promise对象

type getSearchContentList = (params: searchParams) => Promise<contentListData>;

type getcontentDetail = (params: contentDetailreq) => Promise<resDetailData>;