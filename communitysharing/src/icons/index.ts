import { OhVueIcon, addIcons } from "oh-vue-icons"
import { CoSearch,BiHeart,BiHandThumbsUp,MdCreateOutlined,RiVideoLine,BiListUl,BiPlayCircle,BiPauseCircle,BiArrowsFullscreen
  ,BiFullscreenExit,HiVolumeUp,BiVolumeMute,BiVolumeUpFill,CoMediaPlay,LaPauseSolid,MdSkipnextRound,MdSkippreviousRound,BiVolumeUp,
  MdReorderRound, BiChatDots,FaRegularStar,MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import type { App } from "vue"
addIcons(
    CoSearch,
    BiHeart,
    BiHandThumbsUp,
    MdCreateOutlined,
    RiVideoLine,
    BiListUl,
    BiPlayCircle,
    BiPauseCircle,
    BiArrowsFullscreen,
    BiFullscreenExit,
    HiVolumeUp,
    BiVolumeMute,
    BiVolumeUpFill,
    CoMediaPlay,
    LaPauseSolid,
    MdSkipnextRound,
    MdSkippreviousRound,
    BiVolumeUp,
    MdReorderRound,
    BiChatDots,
    FaRegularStar,
    MdDeleteforeverOutlined
)

export default {
  install(app: App) {
    app.component("v-icon", OhVueIcon)
  }
}

// export default function installIcons(app: App) {
//   app.component("v-icon", OhVueIcon)
// }