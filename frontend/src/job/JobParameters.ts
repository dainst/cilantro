import { WorkbenchFileTree, WorkbenchFile, getVisibleFolderContents } from '@/staging/StagingClient';
import { ignoredFolderNames } from '@/config';

export abstract class JobParameters {
    abstract objects: JobObject[];
}

export abstract class ObjectData {
    abstract id: string;
    abstract path: string;
}

export class ObjectError implements ObjectData {
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
    return o instanceof ObjectError;
}

export type JobObject = ObjectData | ObjectError;

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
