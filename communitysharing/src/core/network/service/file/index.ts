import axios from '@/core/network/request/axios';
import upload from '@/core/api/upload';
import type { loadFile } from '@/types/upload/upload';

export const uploadImg:loadFile = (dateForm: FormData) => {
    return axios.post(upload.file, dateForm)
}

export const uploading: loadFile = (dataform: FormData) => {
    return axios.post(upload.file, dataform)
}