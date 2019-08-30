import { sendRequest } from '@/util/HTTPClient';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function getStagingFiles(): Promise<File[]> {
    return sendRequest('get', `${backendUri}/staging`, {}, false);
}

export async function uploadFileToStaging(params: FormData): Promise<boolean> {
    const additionalHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };
    return sendRequest('post', `${backendUri}/staging`, params, false, additionalHeaders);
}
