/**
 * 接收验证码
 */
interface CodeResult {
    success: boolean,
    errorCode?: number,
    message?: string,
}

/**
 * 登录参数
 * @param phone 手机号
 * @param code 验证码
 * @param password 密码
 * @param type 登录方式 1: 验证码登录 2: 密码登录
 */
interface LoginParams {
    phone: string,
    code?: string,
    password?: string
    type: string
}

/**
 * 邮箱登录参数
 * @param email 邮箱
 * @param code 验证码
 */
interface mailloginParams {
    email: string,
    code: string
}

/**
 * 登录结果
 * @param success 是否成功
 * @param data 登录成功返回的token
 * @param message 错误信息
 * @param errorCode 错误码
 */
interface LoginResult {
    success: boolean,
    errorCode?: number,
    message?: string,
    data: string
}

/**
 * 登录用户信息响应
 * @param communitysharingId 用户id
 * @param nickname 用户昵称
 * @param avatar 用户头像
 * @param deleted 是否被删除
 */
interface LoginUserInfoResult {
    success: boolean,
    errorCode?: number,
    message?: string,
    data: {
        communitysharingId: string,
        nickname: string,
        avatar?: string,
        deleted: boolean,
        backgroundImg: string,
        introduction: string
    }
}

/**
 * 用户基础信息
 */
interface UserInfo { 
    communitysharingId: string,
    nickname: string,
    avatar?: string,
    deleted: boolean,
    backgroundImg?: string,
    introduction?: string
}

/**
 * 个人中心的信息
 */
interface AuthDetail {
    avatar: string,
    backgroundImg: string,
    communitysharingId: string,
    createTime: string,
    deleted: boolean,
    email: string,
    introduction: string,
    nickname: string,
    phone: string,
    sex: number
}

/**
 * 用户详情响应体结构
 */
interface UserDetail {
    success: boolean,
    errorCode?: number,
    message?: string,
    data: AuthDetail
}

/**
 * 登出结果响应体结构
 */
interface outloginResult {
    success: boolean,
    errorCode?: number,
    message?: string,
}

/**
 * 修改用户信息结果
 */
interface updateUserDetailResult {
    success: boolean,
    errorCode?: number,
    message?: string,
    data: string
}

interface resetPhoneParams {
    phone: string,
    code: string
}

interface resetPhoneResult {
    success: boolean,
    errorCode?: number,
    message?: string,
}

/**
 * 验证码
 * @param phone 手机号
 * @returns CodeResult 验证码
 */
type SendVerificationCode = (phone: string) => Promise<CodeResult>;

type SendVerificationCodeByMail = (email: string) => Promise<CodeResult>;

/**
 * 登录
 * @param params 登录参数
 * @returns LoginResult 登录结果
 */
type login = (params: LoginParams) => Promise<LoginResult>;

/**
 * 获取登录用户信息
 * @returns LoginUserInfo 登录用户信息
 */
type loginUserInfo = () => Promise<LoginUserInfoResult>;

type mailLogin = (params: mailloginParams) => Promise<LoginResult>;

type outLogining = () => Promise<outloginResult>;

type getUserDetail = () => Promise<UserDetail>;

type updateUserInfo = (params: FormData) => Promise<updateUserDetailResult>;

type updatePassword = (newPassword: string ) => Promise<CodeResult>;

type updateMail = (params: mailloginParams) => Promise<CodeResult>;

type updatePhone = (params: resetPhoneParams) => Promise<resetPhoneResult>;

interface count {
    likeTotal: string,
    collectTotal: string,
    commentTotal: string
}