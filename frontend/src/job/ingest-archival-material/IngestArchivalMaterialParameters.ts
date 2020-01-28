import { JobParameters, ObjectError, ObjectData as GeneralObjectData } from '../JobParameters';
import { AtomDate } from '@/util/AtomClient';

/* eslint-disable camelcase */

export class IngestArchivalMaterialParameters implements JobParameters {
    objects: IngestArchivalMaterialObject[];
    options: IngestArchivalMaterialOptions;

    constructor(objects: IngestArchivalMaterialObject[], options: IngestArchivalMaterialOptions) {
        this.objects = objects;
        this.options = options;
    }
}

export class ObjectData implements GeneralObjectData {
    id: string;
    path: string;
    metadata: ArchivalMaterialMetadata;
    constructor(id: string, path: string, metadata: ArchivalMaterialMetadata) {
        this.id = id;
        this.path = path;
        this.metadata = metadata;
    }
}

export class ArchivalMaterialMetadata {
    atom_id: string;
    title?: string;
    created?: string;
    authors?: string[];
    reference_code?: string;
    creators?: string[];
    dates?: AtomDate[];
    level_of_description?: string;
    extent_and_medium?: string;
    repository?: string;
    scope_and_content?: string;

    constructor(atomId: string, title?: string, created?: string, authors?: string[],
        referenceCode?: string, creators?: string[], dates?: AtomDate[],
        levelOfDescription?: string, extendAndMedium?: string, repository?: string,
        scopeAndContent?: string) {
        this.atom_id = atomId;
        this.title = title;
        this.created = created;
        this.authors = authors;
        this.reference_code = referenceCode;
        this.creators = creators;
        this.dates = dates;
        this.level_of_description = levelOfDescription;
        this.extent_and_medium = extendAndMedium;
        this.repository = repository;
        this.scope_and_content = scopeAndContent;
    }
}

export interface IngestArchivalMaterialOptions {
    do_ocr: boolean;
    ocr_lang: string;
}

export type IngestArchivalMaterialObject = ObjectData | ObjectError;

// export function initRecordObject(path: string): IngestArchivalMaterialObject {
//     const id = path.split('/').pop() || '';
//     return {
//         id,
//         path,
//         metadata: {
//             title: '',
//             created: '',
//             author: [],
//             atom_id: '',
//             reference_code: '',
//             dates: [],
//             level_of_description: '',
//             extent_and_medium: '',
//             creators: [],
//             repository: '',
//             scope_and_content: ''
//         }
//     };
// }
