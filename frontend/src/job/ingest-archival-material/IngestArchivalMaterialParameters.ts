import { JobParameters, JobObject } from '../JobParameters';
import { AtomAuthors, AtomDate } from "@/util/AtomClient";

/* eslint-disable camelcase */

export interface IngestArchivalMaterialParameters extends JobParameters {
    objects: IngestArchivalMaterialObject[];
    options: IngestArchivalMaterialOptions;
}

export interface IngestArchivalMaterialObject extends JobObject {
    metadata: ArchivalMaterialMetadata;
}

export interface ArchivalMaterialMetadata {
    title: string;
    created: string;
    author: string[];
    atom_id: string;
    reference_code: string;
    creators: AtomAuthors[];
    dates: AtomDate[];
    level_of_description: string;
    extent_and_medium: string;
    repository: string;
    scope_and_content: string;
}

export interface IngestArchivalMaterialOptions {
    do_ocr: boolean;
    ocr_lang: string;
}

export function initRecordObject(path: string): IngestArchivalMaterialObject {
    const id = path.split('/').pop() || '';
    return {
        id,
        path,
        metadata: {
            title: '',
            created: '',
            author: [],
            atom_id: '',
            reference_code: '',
            dates: [],
            level_of_description: '',
            extent_and_medium: '',
            creators: [],
            repository: '',
            scope_and_content: ''
        }
    };
}

export function initOptions(): IngestArchivalMaterialOptions {
    return {
        do_ocr: false,
        ocr_lang: 'eng'
    };
}
