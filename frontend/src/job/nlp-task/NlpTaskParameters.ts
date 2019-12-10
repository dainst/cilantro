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
}

export function initOptions(): NlpTaskOptions {
    return {
        lang: 'en',
        tag_intervals: false,
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
