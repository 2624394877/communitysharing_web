export const navTabs = [
    {id: 0, name: "全部",default: true},
    {id: 1, name: "美食",default: false},
    {id: 2, name: "娱乐",default: false},
    {id: 3, name: "游戏",default: false},
    {id: 4, name: "音乐",default: false}
]

export const searchType = [
    {id: 0, name: "默认",default: true,tacitly: 'type'},
    {id: 1, name: "内容/用户",default: false,children:[
        {id: 1, child: "内容",default: false,type: "type"},
        {id: 2, child: "用户",default: false,type: "type"},
    ]},
    {id: 2, name: "排序",default: false,tacitly: 'sort',children:[
        {id: 1, child: "点赞数降序",default: false,type: "sort"},
        {id: 2, child: "评论数降序",default: false,type: "sort"},
        {id: 3, child: "收藏数降序",default: false,type: "sort"},
    ]},
    {id: 3, name: "时间",default: false,tacitly: 'time',children:[ // 时间搜索要-1
        {id: 0, child: "昨天到现在",default: false,type: "time"},
        {id: 1, child: "这周内",default: false,type: "time"},
        {id: 2, child: "这个月内",default: false,type: "time"},
        {id: 3, child: "近半年",default: false,type: "time"}
    ]},
]