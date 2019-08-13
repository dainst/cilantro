import axios from 'axios';

const zenonBaseURL: string = 'https://zenon.dainst.org/';
const zenonAPIURL: string = 'api/v1/';

export async function downloadCSLJSONRecord(id: string): Promise<cslJSONRecord> {
    try {
        const response = await axios({
            method: 'get',
            url: `${zenonBaseURL}Record/${id}/Export?style=CSL-JSON`,
            transformRequest: [(data, headers) => {
                delete headers.common.Authorization; // eslint-disable-line no-param-reassign
                return data;
            }]
        });
        return response.data;
    } catch (err) {
        console.error(err);
        return {
            id: '',
            type: '',
            title: '',
            author: [],
            issued: { raw: '' }
        };
    }
}

export async function search(term: string, scope: string): Promise<ZenonResultData> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}search`;
    const params: object = {
        lookfor: term,
        type: scope
    };
    return makeRequest(url, params);
}

export function getRecord(zenonID: string): Promise<ZenonResultData> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}record`;
    const params: object = {
        id: zenonID
    };
    return makeRequest(url, params);
}

async function makeRequest(url: string, params: object): Promise<ZenonResultData> {
    try {
        const response = await axios({
            method: 'get',
            url,
            params,
            transformRequest: [(data, headers) => {
                delete headers.common.Authorization; // eslint-disable-line no-param-reassign
                return data;
            }]
        });
        return response.data;
    } catch (err) {
        console.error(err);
        return {
            resultCount: 0,
            records: []
        };
    }
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
