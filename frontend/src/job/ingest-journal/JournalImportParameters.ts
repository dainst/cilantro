import { JobParameters, JobObject } from '../JobParameters';

/* eslint-disable camelcase */

export interface JournalIssueMetadata {
    zenon_id: number;
    volume: string;
    year: number;
    number: string;
    description: string;
    identification: string;
}

export interface OJSMetadata {
    ojs_journal_code: string;
    ojs_user: string;
    auto_publish_issue: boolean;
    default_create_frontpage: boolean;
    allow_upload_without_file: boolean;
}

export interface NLPParams {
    lang: string;
}

export interface JournalIssue extends JobObject {
    metadata: JournalIssueMetadata;
}

export interface JournalImportOptions {
    ojs_metadata: OJSMetadata;
    do_ocr: boolean;
    keep_ratio: boolean;
    nlp_params: NLPParams;
}

export interface JournalImportParameters extends JobParameters {
    objects: JournalIssue[];
    options: JournalImportOptions;
}
