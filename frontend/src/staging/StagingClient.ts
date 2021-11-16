import { AxiosRequestConfig } from 'axios';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri, ignoredDirectoryContents } from '@/config';

export async function getStagingFiles(path: string = '', depths: number = 1): Promise<StagingDirectoryContents> {
    return sendRequest('get', `${backendUri}/staging/${stripLeadingSlashes(path)}?depths=${depths}`, {}, {}, false);
}

export function getVisibleAndSortedContents(contents: StagingDirectoryContents): StagingNode[] {
    return Object.values(getVisibleDirectoryContents(contents)).sort(compareStagingNodes);
}

function compareStagingNodes(a: StagingNode, b: StagingNode): number {
    if (a.type === 'directory' && b.type !== 'directory') {
        return -1;
    }
    if (a.type !== 'directory' && b.type === 'directory') {
        return 1;
    }
    return 0;
}

function stripLeadingSlashes(path: string) : string {
    return path.replace(/^\//i, '');
}

export async function uploadFileToStaging(
    params: FormData, onProgress?: (n: number) => void
): Promise<boolean> {
    const config: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (onProgress) config.onUploadProgress = onUploadProgress(onProgress);
    return sendRequest('post', `${backendUri}/staging`, {}, params, false, config);
}

export async function deleteFileFromStaging(filePath: string): Promise<boolean> {
    return sendRequest('delete', `${backendUri}/staging/${stripLeadingSlashes(filePath)}`, {}, {}, false);
}

export async function createFolderInStaging(folderPath: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/folder`, {}, { folderpath: stripLeadingSlashes(folderPath) }, false);
}

export async function moveInStaging(source: string, target: string): Promise<boolean> {
    return sendRequest('post', `${backendUri}/staging/move`, {}, { source: stripLeadingSlashes(source), target: stripLeadingSlashes(target) }, false);
}

export function getVisibleDirectoryContents(contents: StagingDirectoryContents): StagingNode[] {
    return Object.values(contents)
        .filter(file => !file.name.startsWith('.'))
        .filter(file => !ignoredDirectoryContents.includes(file.name));
}

export enum JobInfoStatus {
    success = 'success',
    error = 'error',
    started = 'started'
  }

export interface JobInfo {
    status: JobInfoStatus;
    // eslint-disable-next-line camelcase
    job_id?: string;
    msg?: string;
    url?: string;
    // eslint-disable-next-line camelcase
    url_label?: string;
}

export interface StagingNode {
    name: string;
    type: string;
    // eslint-disable-next-line camelcase
    job_info?: JobInfo;
    contents?: StagingDirectoryContents;
}

export type StagingDirectoryContents = { [index: string]: StagingNode };

function onUploadProgress(onProgressCallback: (n: number) => void) {
    return (progressEvent: { loaded: number, total: number }) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgressCallback(percentCompleted);
    };
}

export function containsNumberOfFiles(contents: StagingDirectoryContents, number: number) {
    return getVisibleDirectoryContents(contents).length === number;
}

/**
 * runs through a StagingDirectoryContents and checks if it only contains files with the
 * given extensions. files with a leading . are considered 'invisible' and are therefor
 * excluded from this search
 *
 * @param contents the directory contents to evaluate
 * @param extensions the extensions to find
 */
export function containsOnlyFilesWithExtensions(
    contents: StagingDirectoryContents, extensions: string[]
) {
    const fileList: StagingNode[] = getVisibleDirectoryContents(contents);
    // check if every file
    // has one of the given extensions
    return fileList.every(file => extensions.some(ext => file.name.endsWith(ext)));
}
