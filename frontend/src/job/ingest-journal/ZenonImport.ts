import axios from 'axios';

const zenonBaseURL: string = 'https://zenon.dainst.org/api/v1/';

function isId(term: string) {
    return !!term.match(/^\w?\w?\d{9}$/);
}

export default async function search(term: string): Promise<ZenonResultData> {
    let apiEndpoint: string = '';
    let params: object = {};
    if (!isId(term)) {
        apiEndpoint = 'search';
        params = {
            lookfor: term,
            type: 'title'
        };
    } else {
        apiEndpoint = 'record';
        params = {
            id: term
        };
    }

    try {
        const response = await axios({
            method: 'get',
            url: `${zenonBaseURL}${apiEndpoint}`,
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
