import Vue from 'vue';
import { JournalImportParameters } from '@/job/ingest-journal/JournalImportParameters';
import { sendRequest, RequestResult } from './HTTPClient';

const backendUri = process.env.VUE_APP_BACKEND_URI;

// TODO params type: union type mit bookimportparameters
export async function startJob(jobType: string, params: JournalImportParameters):
Promise<RequestResult> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, params, false);
}

export async function getJobList(): Promise<RequestResult> {
    return sendRequest('get', `${backendUri}/job/jobs`, {}, false);
}

export async function getJobDetails(jobID: string): Promise<RequestResult> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, false);
}

export async function getStagingFiles(): Promise<RequestResult> {
    return sendRequest('get', `${backendUri}/staging`, {}, false);
}

export async function uploadFileToStaging(params: FormData): Promise<RequestResult> {
    const additionalHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };
    return sendRequest('post', `${backendUri}/staging`, params, false, additionalHeaders);
}
