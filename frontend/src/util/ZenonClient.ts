import Vue from 'vue';
import { sendRequest, showErrorMessage, isHTTPError } from './HTTPClient';

const zenonBaseURL: string = 'https://zenon.dainst.org/';
const zenonAPIURL: string = 'api/v1/';

export async function search(
    term: string,
    scope: string,
    vueInstance: Vue
): Promise<ZenonResultData> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}search`;
    const params: object = {
        lookfor: term,
        type: scope
    };
    const response: any = await sendRequest('get', url, params, true);
    if (isHTTPError(response)) {
        showErrorMessage(response, vueInstance);
        return {
            resultCount: 0,
            records: []
        } as ZenonResultData;
    }
    return response as ZenonResultData;
}

export async function getRecord(zenonID: string, vueInstance: Vue): Promise<ZenonResultData> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}record`;
    const params: object = {
        id: zenonID
    };
    const response: any = await sendRequest('get', url, params, true);
    if (isHTTPError(response)) {
        showErrorMessage(response, vueInstance);
        return {
            resultCount: 0,
            records: []
        } as ZenonResultData;
    }
    return response as ZenonResultData;
}

export async function downloadCSLJSONRecord(id: string, vueInstance: Vue): Promise<cslJSONRecord> {
    const url: string = `${zenonBaseURL}Record/${id}/Export?style=CSL-JSON`;
    const response: any = await sendRequest('get', url, {}, true);
    if (isHTTPError(response)) {
        showErrorMessage(response, vueInstance);
        return {
            id: '',
            type: '',
            title: '',
            author: [],
            issued: { raw: '' }
        } as cslJSONRecord;
    }
    return response as cslJSONRecord;
}

export interface ZenonResultData {
    resultCount: number;
    records: ZenonRecord[];
}

export interface ZenonRecord {
    id: string;
    title: string;
    authors: ZenonAuthors;
    formats: string[];
    languages: string[];
    series: object[];
    subjects: string[];
}

export interface ZenonAuthors {
    primary: object;
    secondary: object;
    corporate: object;
}

export interface cslJSONRecord {
  id: string;
  type: string;
  title: string;
  author: object[];
  issued: cslJSONIssuedObject;
}

interface cslJSONIssuedObject {
    raw: string;
}
