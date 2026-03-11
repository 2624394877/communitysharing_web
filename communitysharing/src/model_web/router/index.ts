export default [
  {
    path: '/',
    redirect: '/discover'
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/model_web/pages/home/HomePage.vue'),
    children: [
      {
        path: '/Personal', // 个人中心
        name: 'Personal',
        component: () => import('@/model_web/pages/profile/personalCenter/PersonalCenter.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'home', // 默认个人中心首页
            redirect: '/Personal/home'
          },
          {
            path: 'home', // 首页
            component: () => import('@/model_web/pages/profile/personalCenter/UserInfo/Homepage/index.vue')
          },
          {
            path: 'info', // 用户信息
            component: () => import('@/model_web/pages/profile/personalCenter/UserInfo/index.vue'),
            meta: { needUserInfo: true },
            children: [
              {
                path: 'password', // 修改密码
                component: () => import('@/model_web/pages/profile/personalCenter/UserInfo/ResetPassword/index.vue')
              },
              {
                path: 'email', // 修改邮箱
                component: () => import('@/model_web/pages/profile/personalCenter/UserInfo/ResetMail/index.vue')
              },
              {
                path: 'phone', // 修改手机号
                component: () => import('@/model_web/pages/profile/personalCenter/UserInfo/ResetPhone/index.vue')
              }
            ]
          },
          {
            path: 'content', // 我的内容
            component: () => import('@/model_web/pages/profile/personalCenter/Content/index.vue')
          },
          {
            path: 'collect', // 我的收藏
            component: () => import('@/model_web/pages/profile/personalCenter/Collect/index.vue')
          },
          {
            path: 'follow', // 我的关注
            component: () => import('@/model_web/pages/profile/personalCenter/Follow/index.vue')
          },
          {
            path: 'record', // 我的记录
            component: () => import('@/model_web/pages/profile/personalCenter/Record/index.vue')
          }
        ]
      }, // 个人中心
      {
        path: '/discover',
        name: 'discover', // 内容的浏览发现
        component: () => import('@/model_web/pages/discover/DiscoverPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/model_web/pages/publish/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/model_web/pages/search/index.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/detail/content',
        name: 'contentDetail',
        component: ()=> import('@/model_web/pages/discover/detail/index.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]