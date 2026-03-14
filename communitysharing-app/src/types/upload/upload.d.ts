import type { extend } from "dayjs"

interface apiUploadRes {
    success: boolean,
    message?: string,
    errorCode?: string
}

interface resURLData extends apiUploadRes {
    data: {
        url: string
    }
}

type loadFile = (data: FormData) => Promise<resURLData>