import { sendRequest } from '@/util/HTTPClient';
import { AxiosRequestConfig } from 'axios';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function getStagingFiles(path: string = ''): Promise<WorkbenchFileTree> {
    return sendRequest('get', `${backendUri}/staging${path}`, {}, false);
}

export async function uploadFileToStaging(params: FormData, onProgress?: (n: number) => void): Promise<boolean> {
    const config: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (onProgress) config.onUploadProgress = onUploadProgress(onProgress);
    return sendRequest('post', `${backendUri}/staging`, params, false, config);
}

export async function deleteFileFromStaging(filePath: string): Promise<boolean> {
    return sendRequest('delete', `${backendUri}/staging/${filePath}`, {}, false);
}

export async function createFolderInStaging(folderPath: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/folder`, { folderpath: folderPath }, false);
}

export async function moveInStaging(source: string, target: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/move`, { source, target }, false);
}

export interface WorkbenchFile {
    name: string;
    type: string;
    contents?: { [index: string]: WorkbenchFile }
}

export type WorkbenchFileTree = { [index: string]: WorkbenchFile };

function onUploadProgress(onProgressCallback: (n: number) => void) {
    return (progressEvent: { loaded: number, total: number }) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgressCallback(percentCompleted);
    }
}
