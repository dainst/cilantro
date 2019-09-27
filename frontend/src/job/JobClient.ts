import { JournalImportParameters } from './ingest-journal/JournalImportParameters';
import { sendRequest } from '@/util/HTTPClient';
import { Job } from './Job';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function startJob(
    jobType: string,
    params: JournalImportParameters
): Promise<boolean> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, params, false);
}

export async function getJobList(): Promise<Job[]> {
    return sendRequest('get', `${backendUri}/job/jobs`, {}, false);
}

export async function getJobDetails(jobID: string): Promise<Job> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, false);
}
