import { AxiosRequestConfig } from 'axios';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri, ignoredFolderNames } from '@/config';

export async function getStagingFiles(path: string = '', depths: number = 1): Promise<WorkbenchFileTree> {
    return sendRequest('get', `${backendUri}/staging/${path}?depths${depths}`, {}, {}, false);
}

export async function uploadFileToStaging(
    params: FormData, onProgress?: (n: number) => void
): Promise<boolean> {
    const config: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (onProgress) config.onUploadProgress = onUploadProgress(onProgress);
    return sendRequest('post', `${backendUri}/staging`, {}, params, false, config);
}

export async function deleteFileFromStaging(filePath: string): Promise<boolean> {
    return sendRequest('delete', `${backendUri}/staging/${filePath}`, {}, {}, false);
}

export async function createFolderInStaging(folderPath: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/folder`, {}, { folderpath: folderPath }, false);
}

export async function moveInStaging(source: string, target: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/move`, {}, { source, target }, false);
}

export function getVisibleFolderContents(tree: WorkbenchFileTree): WorkbenchFile[] {
    return Object.values(tree)
        .filter(file => !file.name.startsWith('.'))
        .filter(file => !ignoredFolderNames.includes(file.name));
}

export interface WorkbenchFile {
    name: string;
    type: string;
    marked: boolean;
    contents?: WorkbenchFileTree;
}

export type WorkbenchFileTree = { [index: string]: WorkbenchFile };

function onUploadProgress(onProgressCallback: (n: number) => void) {
    return (progressEvent: { loaded: number, total: number }) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgressCallback(percentCompleted);
    };
}

export function containsNumberOfFiles(folder: WorkbenchFileTree, number: number) {
    return getVisibleFolderContents(folder).length === number;
}

/**
 * runs through a WorkbenchFileTree and checks if it only contains files with the given extensions.
 * files with a leading . are considered 'invisible' and are therefor excluded from this search
 *
 * @param folder the folder to lookup
 * @param extensions the extensions to find
 */
export function containsOnlyFilesWithExtensions(
    folder: WorkbenchFileTree, extensions: string[]
) {
    const fileList: WorkbenchFile[] = getVisibleFolderContents(folder);
    // check if every file
    // has one of the given extensions
    return fileList.every(file => extensions.some(ext => file.name.endsWith(ext)));
}