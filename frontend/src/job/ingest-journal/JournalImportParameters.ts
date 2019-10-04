import { JobParameters, JobObject } from '../JobParameters';

/* eslint-disable camelcase */

export interface JournalIssueMetadata {
    zenon_id: number;
    volume: number;
    year: number;
    number: number;
    description: string;
    ojs_journal_code: string;
}

export interface OJSMetadata {
    auto_publish_issue: boolean;
    default_create_frontpage: boolean;
    allow_upload_without_file: boolean;
}

export interface JournalIssue extends JobObject {
    metadata: JournalIssueMetadata;
}

export interface JournalImportOptions {
    ojs_metadata: OJSMetadata;
}

export interface JournalImportParameters extends JobParameters {
    objects: JournalIssue[];
    options: JournalImportOptions;
}

export function initIssue(path: string): JournalIssue {
    const id = path.split('/').pop() || '';
    return {
        id,
        path,
        metadata: {
            zenon_id: 0,
            volume: 1,
            year: 0,
            number: 1,
            description: '',
            ojs_journal_code: ''
        }
    };
}

export function initOptions(): JournalImportOptions {
    return {
        ojs_metadata: {
            auto_publish_issue: true,
            default_create_frontpage: true,
            allow_upload_without_file: false
        }
    };
}
