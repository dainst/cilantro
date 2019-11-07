import { JobParameters, JobObject } from '../JobParameters';

/* eslint-disable camelcase */

export interface BookImportParameters extends JobParameters {
    objects: Book[];
    options: BookImportOptions;
}

export interface Book extends JobObject {
    metadata: BookMetadata;
}

export interface BookMetadata {
    title: string;
    created: string;
    author: string[];
    atom_id: string;
}

export interface BookImportOptions {
    do_ocr: boolean;
    ocr_lang: string;
}

export function initBook(path: string): Book {
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

export function initOptions(): BookImportOptions {
    return {
        do_ocr: false,
        ocr_lang: 'eng'
    };
}
