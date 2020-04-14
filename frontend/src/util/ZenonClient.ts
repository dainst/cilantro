import Vue from 'vue';
import { sendRequest } from './HTTPClient';

const zenonBaseURL: string = 'https://zenon.dainst.org/';
const zenonAPIURL: string = 'api/v1/';

export async function search(term: string, scope: string): Promise<ZenonResultData> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}search`;
    const params: object = {
        lookfor: term,
        type: scope
    };
    return sendRequest('get', url, {}, params, true);
}

export async function getRecord(zenonID: string): Promise<ZenonRecord> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}record`;
    const params: object = {
        id: zenonID
    };
    return sendRequest('get', url, {}, params, true).then(response => response.records[0]);
}

export async function downloadCSLJSONRecord(id: string): Promise<cslJSONRecord> {
    const url: string = `${zenonBaseURL}Record/${id}/Export?style=CSL-JSON`;
    return sendRequest('get', url, {}, {}, true);
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
    containerReference: string;
    publicationDates: string[];
    parentId?: string;
    summary: string
    primaryAuthorsNames: string[],
    secondaryAuthorsNames: string[],
    corporateAuthorsNames: string[],
    shortTitle: string,
    subTitle: string
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
