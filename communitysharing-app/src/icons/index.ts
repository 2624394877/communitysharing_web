import { OhVueIcon, addIcons } from "oh-vue-icons"
import { CoSearch,BiHeart,BiHandThumbsUp,MdCreateOutlined,RiVideoLine,BiListUl,BiPlayCircle,BiPauseCircle,BiArrowsFullscreen
  ,BiFullscreenExit,HiVolumeUp,BiVolumeMute,BiVolumeUpFill,CoMediaPlay,LaPauseSolid,MdSkipnextRound,MdSkippreviousRound,BiVolumeUp,
  MdReorderRound, BiChatDots,FaRegularStar,MdDeleteforeverOutlined,LaCloudUploadAltSolid } from "oh-vue-icons/icons";

export default function installIcons(app:any) {

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
    MdDeleteforeverOutlined,
    LaCloudUploadAltSolid
)
  app.component('v-icon', OhVueIcon)
}