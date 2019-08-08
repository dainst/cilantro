import axios from 'axios';

const zenonSearchUri = 'https://zenon.dainst.org/api/v1/search';

export default async function search(term: string): Promise<ZenonRecord[]> {
    const params = {
        lookfor: term
    };

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
        return [];
    }
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
