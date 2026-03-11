import mitt from "mitt";

// 事件总线的消息常量表
type Events = {
  "getUserInfoTopic":UserInfo;
  "noMoreDataTopic": boolean;
  "emptyTopic": boolean;
  "searchUser": searchParams;
};

const emitter = mitt<Events>();

export default emitter;