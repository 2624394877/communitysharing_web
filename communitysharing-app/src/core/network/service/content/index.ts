import axios from '@/core/network/request/axios';
import api from '@/core/api';

const {content} = api;

export const getContentsList: getContentListData = (pageNo:number) => {
    return axios.post(content.gethomeContent,{pageNo})
}

export const getContentsListByChannel: getContentListbyChannel = (channelId:number,pageNo:number) => {
    return axios.post(content.getContentsListBychannelId,{channelId,pageNo})
}

export const getSearchContentlist: getSearchContentList = (params:searchParams) => {
    return axios.post(content.searchContent,params)
}

export const getContentDetail: getcontentDetail = (params: contentDetailreq) => {
    return axios.post(content.contentDetail,params)
}

export const getcontentCount: getContentCount = (contentId: string) => {
    return axios.post(content.contentCount,{contentId})
}

export const getUserForContentStatus: getUserStatuscontent = (contentId: string) => {
    return axios.post(content.contentIslikeOrCollect,{contentId})
}

export const Like: toLikeOrCollect = (contentId: string) => {
    return axios.post(content.like, {contentId})
}

export const UnLike: toLikeOrCollect = (contentId: string) => {
    return axios.post(content.unlike, {contentId})
}

export const Collect: toLikeOrCollect = (contentId: string) => {
    return axios.post(content.collect, {contentId})
}

export const UnCollect: toLikeOrCollect = (contentId: string) => {
    return axios.post(content.uncollect, {contentId})
}

export const ReBuildContent: reBuildContent = (contentId: string,creatorId: string) => {
    return axios.post(content.rebuildContent,{contentId,userId: creatorId})
}