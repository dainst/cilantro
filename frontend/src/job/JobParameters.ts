/* eslint-disable camelcase */
import { WorkbenchFileTree, getVisibleFolderContents, WorkbenchFile } from '@/staging/StagingClient';

export abstract class JobParameters {
    abstract targets: MaybeJobTarget[];
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

export interface OCROptions {
    do_ocr: boolean;
    ocr_lang: string;
}

export interface AppOptions {
    mark_done: boolean;
}

export function isTargetError(o: any) {
    return o instanceof JobTargetError;
}

export type MaybeJobTarget = JobTargetData | JobTargetError;

