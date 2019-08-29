import Vue from 'vue';
import { JournalImportParameters } from '@/job/ingest-journal/JournalImportParameters';
import { BookImportParameters } from '@/job/ingest-book/BookImportParameters';
import { sendRequest, RequestResult } from './HTTPClient';
import { Job } from '@/job/Job';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export async function startJob(
    jobType: string,
    params: JournalImportParameters|BookImportParameters
): Promise<boolean> {
    return sendRequest('post', `${backendUri}/job/${jobType}`, params, false)
        .then(response => true);
}

export async function getJobList(): Promise<Job[]> {
    return sendRequest('get', `${backendUri}/job/jobs`, {}, false)
        .then(response => response.payload);
}

export async function getJobDetails(jobID: string): Promise<Job> {
    return sendRequest('get', `${backendUri}/job/${jobID}`, {}, false)
        .then(response => response.payload);
}

export async function getStagingFiles(): Promise<File[]> {
    return sendRequest('get', `${backendUri}/staging`, {}, false)
        .then(response => response.payload);
}

export async function uploadFileToStaging(params: FormData): Promise<boolean> {
    const additionalHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };
    return sendRequest('post', `${backendUri}/staging`, params, false, additionalHeaders)
        .then(response => true);
}
