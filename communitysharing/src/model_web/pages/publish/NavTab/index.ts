import { fileType } from "@/types/enum"

export const navTabs = [
    {id: 0, name: "图片",default: true, type:0,filetype: fileType.image},
    {id: 1, name: "文本",default: false, type:0,filetype: fileType.text},
    {id: 2, name: "视频",default: false, type:1, filetype: fileType.video},
    {id: 3, name: "音频",default: false, type:1, filetype: fileType.audio},
    {id: 4, name: "文档",default: false, type:2, filetype: fileType.doc},
    {id: 5, name: "链接",default: false, type:3, filetype: fileType.link}
]

export const cannelTab = [
    {id: 1, name: "美食",default: false},
    {id: 2, name: "娱乐",default: false},
    {id: 3, name: "游戏",default: false},
    {id: 4, name: "音乐",default: false}
]

export const topicTab = [
    {id: 1, name: "高分美剧推荐",default: false},
    {id: 2, name: "周边美食推荐",default: false},
    {id: 3, name: "热门游戏推荐",default: false},
    {id: 4, name: "音乐视频推荐",default: false}
]