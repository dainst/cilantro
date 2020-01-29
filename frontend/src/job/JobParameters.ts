import { WorkbenchFileTree, WorkbenchFile, getVisibleFolderContents } from '@/staging/StagingClient';

export abstract class JobParameters {
    abstract objects: JobObject[];
}

export abstract class JobTargetData {
    abstract id: string;
    abstract path: string;
}

export class JobTargetError implements JobTargetData {
    id: string;
    path: string;
    messages: string[];
    constructor(id: string, path: string, input: string[]) {
        this.id = id;
        this.path = path;
        this.messages = input;
    }
}

export function isObjectError(o: any) {
    return o instanceof JobTargetError;
}

export type JobObject = JobTargetData | JobTargetError;

export async function getObjectFolder(stagingFiles: WorkbenchFileTree, objectId: string) {
    return getStagingFile(stagingFiles, objectId);
}

function getStagingFile(stagingFiles: WorkbenchFileTree, path: string): WorkbenchFileTree | {} {
    return path.split('/').reduce((folderTree, folderName) => {
        if (folderName in folderTree) {
            return folderTree[folderName].contents || {};
        }
        return {};
    }, stagingFiles);
}

export function containsNumberOfFiles(folder: WorkbenchFileTree, number: number) {
    if (getVisibleFolderContents(folder).length !== number) {
        return false;
    }
    return true;
}

export function containsOnlyFilesWithSuffix(folder: { [index: string]: WorkbenchFile },
    suffix: string) {
    const differentSuffixFiles = Object.keys(folder).filter(file => !file.endsWith(suffix));
    if (differentSuffixFiles.length !== 0) return false;
    return true;
}
