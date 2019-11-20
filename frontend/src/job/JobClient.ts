import { JobParameters } from './JobParameters';
import { sendRequest } from '@/util/HTTPClient';
import { backendUri } from '@/config';

export async function startJob(
    jobType: string,
    params: JobParameters
): Promise<boolean> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, params, false);
}

export async function getJobList(getAllJobs: boolean): Promise<Job[]> {
    return sendRequest('get', `${backendUri}/job/jobs`, { show_all_jobs: getAllJobs }, false);
}

export async function getJobDetails(jobID: string): Promise<Job> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, false);
}

export interface Job {
    children: object[];
    created: string;
    duration:string;
    errors: object[]; // TODO proper error interface
    job_id: string; // eslint-disable-line camelcase
    job_type: string; // eslint-disable-line camelcase
    name: string;
    parameters: object;
    parent_job_id:string; // eslint-disable-line camelcase
    started:string;
    state: string;
    updated: string;
    user: string;
}
