import { JobParameters } from './JobParameters';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri } from '@/config';

export async function startJob(
    jobType: string,
    params: JobParameters
): Promise<boolean> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, {}, params, false);
}

export async function getJobList(getAllJobs: boolean): Promise<Job[]> {
    return sendRequest('get', `${backendUri}/job/jobs`, {}, { show_all_jobs: getAllJobs }, false);
}

export async function getJobDetails(jobID: string): Promise<Job> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, {}, false);
}

export function iconAttributesForState(state: string) {
    if (state === 'new') {
        return [{ type: 'is-info' }, { icon: 'alarm' }];
    } if (state === 'failure') {
        return [{ type: 'is-danger' }, { icon: 'alert' }];
    } if (state === 'aborted') {
        return [{ type: 'is-danger' }, { icon: 'cancel' }];
    }
    if (state === 'success') {
        return [{ type: 'is-success' }, { icon: 'check' }];
    }
    return [{ type: 'is-warning' }, { icon: 'cogs' }];
}

export interface Job {
    children: object[];
    created: string;
    duration: string;
    errors: object[]; // TODO proper error interface
    log: string[];
    job_id: string; // eslint-disable-line camelcase
    job_type: string; // eslint-disable-line camelcase
    name: string;
    label: string;
    description: string;
    parameters: object;
    parent_job_id: string; // eslint-disable-line camelcase
    started: string;
    state: string;
    updated: string;
    user: string;
}
