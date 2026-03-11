import axios from '@/core/network/request/axios';
import api from '@/core/api';
import type {getSearchUserInfo, searchUserParams} from "@/types/userServer"

const {user} = api;

export const getSearchUserReq: getSearchUserInfo = (params:searchUserParams) => {
    return axios.post(user.searchUserServer,params)
}

export const following: followORUnfollow = (followingUserId: string) => {
    return axios.post(user.follwing,followingUserId)
}

export const unfollowing: followORUnfollow = (followingUserId: string) => {
    return axios.post(user.unfollowing,followingUserId)
}