export const loginType = {
    phone: 1, // 手机号验证码登录
    password: 2, // 密码登录
    mail: 3 // 邮箱登录
} as const;

export const pushRouterActive = {
    discover: '/discover',
    publish: '/publish'
}

export const conditionType = {
    type: 'type',
    sort: 'sort',
    time: 'time'
} as const;