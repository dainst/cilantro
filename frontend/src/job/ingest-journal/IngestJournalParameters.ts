/* eslint-disable camelcase */
import {
    JobParameters, JobTargetError, JobTargetData as GenericJobTargetData, OCROptions
} from '../JobParameters';

export class IngestJournalParameters implements JobParameters {
    targets: MaybeJobTarget[];
    options: IngestJournalOptions;

    constructor(target: MaybeJobTarget[], options: IngestJournalOptions) {
        this.targets = target;
        this.options = options;
    }
}

export class JobTargetData implements GenericJobTargetData {
    id: string;
    path: string;
    metadata: JournalIssueMetadata;
    constructor(id: string, path: string, metadata: JournalIssueMetadata) {
        this.id = id;
        this.path = path;
        this.metadata = metadata;
    }
}

export class JournalIssueMetadata {
    zenon_id: string;
    ojs_journal_code: string;
    volume?: number;
    publishing_year?: number;
    number?: number;
    title: string;
    reporting_year?: number;
    articles?: JournalArticleMetadata[];

    constructor(zenonId: string, ojsJournalCode: string, title: string) {
        this.zenon_id = zenonId;
        this.ojs_journal_code = ojsJournalCode;
        this.title = title;
    }
}

export class JournalArticleMetadata {
    zenon_id: string;
    title: string;
    authors?: Person[];

    constructor(zenonId: string, title: string) {
        this.zenon_id = zenonId;
        this.title = title;
    }
}

export interface Person {
    givenname: string;
    lastname: string;
}

export interface IngestJournalOptions {
    ocr_options: OCROptions;
}

export interface OJSOptions {
    default_create_frontpage: boolean;
}

export type MaybeJobTarget = JobTargetData | JobTargetError;
