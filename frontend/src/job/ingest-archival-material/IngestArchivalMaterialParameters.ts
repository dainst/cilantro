import {
    JobParameters, JobTargetError, JobTargetData as GenericJobTargetData, OCROptions
} from '../JobParameters';
import { AtomDate } from '@/util/AtomClient';

/* eslint-disable camelcase */

export class IngestArchivalMaterialParameters implements JobParameters {
    targets: MaybeJobTarget[];
    options: OCROptions;

    constructor(target: MaybeJobTarget[], options: OCROptions) {
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

    constructor(atomId: string) {
        this.atom_id = atomId;
    }
}

export type MaybeJobTarget = JobTargetData | JobTargetError;
