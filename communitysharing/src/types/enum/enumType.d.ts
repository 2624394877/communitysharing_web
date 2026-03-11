import { loginType,pushRouterActive } from "@/types/enum";
export type LoginType = typeof loginType[keyof typeof loginType];
export type PushRouterActive = typeof pushRouterActive[keyof typeof pushRouterActive];
export type LikeOrCollect = typeof likeOrcollect[keyof typeof likeOrcollect]