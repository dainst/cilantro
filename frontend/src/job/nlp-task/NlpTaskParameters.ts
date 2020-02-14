import { JobParameters, JobObject } from '../JobParameters';

/* eslint-disable camelcase */

export interface NlpTaskParameters extends JobParameters {
    objects: JobObject[];
    options: NlpTaskOptions;
}

export interface NlpTaskTargetTextFile extends JobObject {
}

export interface NlpTaskOptions {
    lang: string;
    tag_intervals: boolean;
    read_dct_from_metadata: boolean;
    document_creation_time: string;
}

// Export a helper funtcion to properly fromat the document creation
// time string in the task options. (Could be a member of the NlpTaskOptions,
// but converting that to a class is too much hassle)
export function formatDCTString(date: Date): string {
    // Return only the date portion of an ISO formatted datetime,
    // e.g. "1970-01-01". Ignore the local timezone via UTC().
    const utc_date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
    const match = utc_date.toISOString().match("^[0-9\-]+")
    return match != null ? match[0] : ""
}

export function initOptions(): NlpTaskOptions {
    return {
        lang: 'en',
        tag_intervals: false,
        read_dct_from_metadata: false,
        document_creation_time: formatDCTString(new Date()),
    };
}

export function initNlpTaskTargetTextfile(path: string): NlpTaskTargetTextFile  {
    const id = path.split('/').join("-");
    return {
        id,
        path,
        metadata: {}
    }
}
