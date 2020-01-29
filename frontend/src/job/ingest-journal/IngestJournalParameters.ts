/* eslint-disable camelcase */
import { JobParameters, JobTargetError, JobTargetData as GenericJobTargetData } from '../JobParameters';
import { ZenonRecord } from '@/util/ZenonClient';

export class IngestJournalParameters implements JobParameters {
    objects: IngestJournalObject[];
    options: IngestJournalOptions;

    constructor(objects: IngestJournalObject[], options: IngestJournalOptions) {
        this.objects = objects;
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
    volume?: number;
    publishing_year?: number;
    number?: number;
    description?: string;
    ojs_journal_code?: string;
    reporting_year?: number;

    constructor(zenonId: string, volume?: number, publishingYear?: number,
        number?: number, description?: string, ojsJournalCode?: string,
        reportingYear?: number) {
        this.zenon_id = zenonId;
        this.volume = volume;
        this.publishing_year = publishingYear;
        this.number = number;
        this.description = description;
        this.ojs_journal_code = ojsJournalCode;
        this.reporting_year = reportingYear;
    }
}

export interface IngestJournalOptions {
    ojs_metadata: OJSMetadata;
    do_ocr: boolean;
    ocr_lang: string;
}

export interface OJSMetadata {
    auto_publish_issue: boolean;
    default_create_frontpage: boolean;
    allow_upload_without_file: boolean;
}

export type IngestJournalObject = JobTargetData | JobTargetError;
