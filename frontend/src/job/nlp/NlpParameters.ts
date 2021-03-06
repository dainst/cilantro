import { JobParameters, JobTargetData, MaybeJobTarget } from '../JobParameters';

/* eslint-disable camelcase */

export interface NlpParameters extends JobParameters {
    targets: MaybeJobTarget[];
    options: NlpOptions;
}

export interface NlpTargetFolder extends JobTargetData {
    metadata: {}
}

export interface NlpOptions {
    lang: string;
    read_dct_from_metadata: boolean;
    document_creation_time: string;
    extensions: string[];
}

// Export a helper funtcion to properly fromat the document creation
// time string in the task options. (Could be a member of the NlpOptions,
// but converting that to a class is too much hassle)
export function formatDCTString(date: Date): string {
    // Return only the date portion of an ISO formatted datetime,
    // e.g. "1970-01-01". Ignore the local timezone via UTC().
    const utc_date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
    const match = utc_date.toISOString().match("^[0-9\-]+")
    return match != null ? match[0] : ""
}

export function initOptions(): NlpOptions {
    return {
        lang: 'en',
        read_dct_from_metadata: false,
        document_creation_time: formatDCTString(new Date()),
        extensions: ['txt']
    };
}

export function initNlpTargetFolder(path: string): NlpTargetFolder  {
    const id = path.split('/').join("-");
    return {
        id,
        path,
        metadata: {}
    }
}
