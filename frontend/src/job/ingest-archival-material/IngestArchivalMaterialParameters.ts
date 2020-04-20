import {
    JobParameters, JobTargetError, JobTargetData as GenericJobTargetData, OCROptions, AppOptions
} from '../JobParameters';
import { AtomDate } from '@/util/AtomClient';

/* eslint-disable camelcase */

export class IngestArchivalMaterialParameters implements JobParameters {
    targets: MaybeJobTarget[];
    options: IngestArchivalOptions;

    constructor(target: MaybeJobTarget[], options: IngestArchivalOptions) {
        this.targets = target;
        this.options = options;
    }
}

export class JobTargetData implements GenericJobTargetData {
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
    copyright: string;
    title?: string;
    created?: string;
    authors?: string[];
    reference_code?: string;
    creators?: string[];
    dates?: AtomDate[];
    level_of_description?: string;
    extent_and_medium?: string;
    repository?: string;
    repository_inherited_from?: string;
    scope_and_content?: string;

    constructor(atomId: string, copyright: string) {
        this.atom_id = atomId;
        this.copyright = copyright;
    }
}

export interface IngestArchivalOptions {
    ocr_options: OCROptions;
    app_options: AppOptions;
}

export type MaybeJobTarget = JobTargetData | JobTargetError;
