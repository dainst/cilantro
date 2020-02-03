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

export type MaybeJobTarget = JobTargetData | JobTargetError;
