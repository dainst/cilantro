import Vue from 'vue';
import { JournalImportParameters } from '@/job/ingest-journal/JournalImportParameters';
import { Job } from '@/job/Job';
import { sendRequest, showErrorMessage, isHTTPError } from './HTTPClient';

const backendUri = process.env.VUE_APP_BACKEND_URI;

export default async function startJob(
    jobType: string,
    params: JournalImportParameters, // TODO params type: union type mit bookimportparameters
    vueInstance: Vue
) {
    const response: any = await sendRequest('post', `${backendUri}/job/${jobType}`, params, false);
    if (isHTTPError(response)) {
        showErrorMessage(response, vueInstance);
    } else {
        vueInstance.$snackbar.open({
            message: 'Job started successfully',
            type: 'is-success',
            position: 'is-top',
            duration: 5000,
            queue: false
        });
    }
}

export async function getJobList(vueInstance: Vue): Promise<Job[]> {
    const response: any = await sendRequest('get', `${backendUri}/job/jobs`, {}, false);
    if (isHTTPError(response)) {
        showErrorMessage(response, vueInstance);
        return [];
    }
    return response as Job[];
}
