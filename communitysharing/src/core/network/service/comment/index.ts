import axios from '@/core/network/request/axios';
import comment from '@/core/api/comments/index';

export const getBatchComment: batchComment = (params:reqParams) => {
    return axios.post(comment.batch,params);
}

export const getBatchChildComment: batchChildComment = (params: reqChildParams) => {
    return axios.post(comment.batchChild,params)
}

export const publishComment: Publish = (params: publish) => {
    return axios.post(comment.publish,params)
}

export const getLike: likeOrNot = (commentId: number) => {
    return axios.post(comment.like,{commentId})
}

export const getUnlike: likeOrNot = (commentId: number) => {
    return axios.post(comment.unlike, {commentId})
}

export const Del: deleteComment = (commentId: number) => {
    return axios.post(comment.del,{commentId})
}