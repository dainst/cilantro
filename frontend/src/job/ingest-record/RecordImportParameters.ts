import { JobParameters, JobObject } from '../JobParameters';

/* eslint-disable camelcase */

export interface RecordImportParameters extends JobParameters {
    objects: RecordObject[];
    options: RecordImportOptions;
}

export interface RecordObject extends JobObject {
    metadata: RecordMetadata;
}

export interface RecordMetadata {
    title: string;
    created: string;
    author: string[];
    atom_id: string;
}

export interface RecordImportOptions {
    do_ocr: boolean;
    ocr_lang: string;
}

export function initRecordObject(path: string): RecordObject {
    const id = path.split('/').pop() || '';
    return {
        id,
        path,
        metadata: {
            title: '',
            created: '',
            author: [],
            atom_id: ''
        }
    };
}

export function initOptions(): RecordImportOptions {
    return {
        do_ocr: false,
        ocr_lang: 'eng'
    };
}
