import { onMounted,onUnmounted } from 'vue';
import mitter from '@/core/bus/index'
import consumerMessageConstants from '@/model_web/pages/home/model/dto/userDto';

export function useUserEvent(handler: (data: UserInfo) => void) {
    onMounted(() => {
        mitter.on(
            consumerMessageConstants.GET_USER_INFO_TOPIC,
            handler
        );
    })

    onUnmounted(() => {
        mitter.off(
            consumerMessageConstants.GET_USER_INFO_TOPIC,
            handler
        );
    });
}