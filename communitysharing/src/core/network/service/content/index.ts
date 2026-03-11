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