import { JournalImportParameters } from './ingest-journal/JournalImportParameters';
import { sendRequest } from '@/util/HTTPClient';
import { Job } from './Job';
import { backendUri } from '@/config';

export async function startJob(
    jobType: string,
    params: JournalImportParameters
): Promise<boolean> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, params, false);
}

export async function getJobList(get_all:boolean): Promise<Job[]> {
    return sendRequest('get', `${backendUri}/job/jobs`, {show_all_jobs:get_all}, false);
}

export async function getJobDetails(jobID: string): Promise<Job> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, false);
}
