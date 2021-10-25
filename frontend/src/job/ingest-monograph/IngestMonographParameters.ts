/* eslint-disable camelcase */
import {
    JobParameters, JobTargetError, JobTargetData as GenericJobTargetData, OCROptions
} from '../JobParameters';

export class IngestMonographParameters implements JobParameters {
    targets: MaybeJobTarget[];
    options: IngestMonographOptions;

    constructor(target: MaybeJobTarget[], options: IngestMonographOptions) {
        this.targets = target;
        this.options = options;
    }
}

export class JobTargetData implements GenericJobTargetData {
    id: string;
    path: string;
    metadata: MonographMetadata;
    constructor(id: string, path: string, metadata: MonographMetadata) {
        this.id = id;
        this.path = path;
        this.metadata = metadata;
    }
}

export class MonographMetadata {
    zenon_id: string;
    press_code?: string;
    authors?: Person[];
    title?: string;
    subtitle?: string;
    abstract?: string;
    date_published?: string;

    constructor(zenonId: string) {
        this.zenon_id = zenonId;
    }
}

export interface Person {
    givenname: string;
    lastname: string;
}

export interface IngestMonographOptions {
    ocr_options: OCROptions;
}

export type MaybeJobTarget = JobTargetData | JobTargetError;
