import axios from '@/core/network/request/axios';
import comment from '@/core/api/comments/index';

export const getBatchComment: batchComment = (params:reqParams) => {
    return axios.post(comment.batch,params);
}

export const getBatchChildComment: batchChildComment = (params: reqChildParams) => {
    return axios.post(comment.batchChild,params)
}