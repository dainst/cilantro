import { sendRequest } from '@/util/HTTPClient';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function getStagingFiles(path: string = '/'): Promise<WorkbenchFile[]> {
    return sendRequest('get', `${backendUri}/staging${path}`, {}, false);
}

export async function uploadFileToStaging(params: FormData): Promise<boolean> {
    const additionalHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };
    return sendRequest('post', `${backendUri}/staging`, params, false, additionalHeaders);
}

export async function deleteFileFromStaging(filePath: string): Promise<boolean> {
    return sendRequest('delete', `${backendUri}/staging/${filePath}`, {}, false);
}

export async function createFolderInStaging(folderPath: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/folder`, { folderpath: folderPath }, false);
}

export interface WorkbenchFile {
    name: string;
    type: string;
    contents: WorkbenchFile[]
}
