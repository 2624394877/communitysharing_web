import axios from '@/core/network/request/axios';
import api from '@/core/api';

const {auth} = api;
// 获取验证码
export const getVerificationCode: SendVerificationCode = (phone) => {
    return axios.post(auth.sendVerificationCode, {phone});
};

export const getVerificationCodeByMail: SendVerificationCodeByMail = (email:  string) => {
    return axios.post(auth.sendVerificationCodeByEmail, {email});
};

// 登录
export const Login: login = (parsams)=>{
    return axios.post(auth.login, parsams);
}

export const LoginByEmail: mailLogin = (params)=>{
    return axios.post(auth.loginByEmail, params);
}

export const getLoginUserInfo: loginUserInfo = () => {
    return axios.get(auth.findUser);
}
export const OutLogin: outLogining = () => {
    return axios.get(auth.loginOut)
}

export const getUserInfo: getUserDetail = () => {
    return axios.get(auth.getUserInfo)
}

export const resetPassword: updatePassword = (newPassword: string) => {
    return axios.post(auth.updatePassword, {newPassword})
}

export const updateUser: updateUserInfo = (data: FormData) => {
    return axios.post(auth.updateUserInfo, data)
}

export const resetMail: updateMail = (mailloginParams) => {
    return axios.post(auth.updateUserMail, mailloginParams)
}

export const resetPhone: updatePhone = (resetPhoneParams) => {
    return axios.post(auth.updateUserPhone, resetPhoneParams)
}