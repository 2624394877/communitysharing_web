import { ElLoading } from "element-plus";

export const request_wait_method_forUser = (message: string, req: string) => {
    return ElLoading.service({
        lock: true,
        text: `${req}请求正在等待${message}数据...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
}