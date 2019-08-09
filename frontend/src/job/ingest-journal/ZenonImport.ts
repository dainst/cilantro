import axios from 'axios';

const zenonSearchUri = 'https://zenon.dainst.org/api/v1/search';

    const params = {
        lookfor: term
    };
export default async function search(term: string): Promise<ZenonResultData> {

    try {
        const response = await axios.get(
            zenonSearchUri, {
                params,
                transformRequest: [(data, headers) => {
                    delete headers.common.Authorization; // eslint-disable-line no-param-reassign
                    return data;
                }]
            }
        );
        return response.data.records;
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
