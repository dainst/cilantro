/* eslint-disable camelcase */
import {
    JobParameters, JobTargetError, JobTargetData as GenericJobTargetData, OCROptions, AppOptions
} from '../JobParameters';

export class IngestBookParameters implements JobParameters {
    targets: MaybeJobTarget[];
    options: IngestBookOptions;

    constructor(target: MaybeJobTarget[], options: IngestBookOptions) {
        this.targets = target;
        this.options = options;
    }
}

export class JobTargetData implements GenericJobTargetData {
    id: string;
    path: string;
    metadata: BookIssueMetadata;
    constructor(id: string, path: string, metadata: BookIssueMetadata) {
        this.id = id;
        this.path = path;
        this.metadata = metadata;
    }
}

export class BookIssueMetadata {
    zenon_id: string;
    volume?: number;
    publishing_year?: number;
    number?: number;
    description?: string;
    ojs_Book_code?: string;
    reporting_year?: number;

    constructor(zenonId: string) {
        this.zenon_id = zenonId;
    }
}

export interface IngestBookOptions {
    ojs_options: OJSOptions;
    ocr_options: OCROptions;
    app_options: AppOptions;
}

export interface OJSOptions {
    default_create_frontpage: boolean;
}

export type MaybeJobTarget = JobTargetData | JobTargetError;
