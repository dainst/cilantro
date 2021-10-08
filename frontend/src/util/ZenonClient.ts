import { sendRequest } from './HTTPClient';

const zenonBaseURL: string = 'https://zenon.dainst.org/';
const zenonAPIURL: string = 'api/v1/';

export class ZenonRecord {
    id: string;
    title: string;
    authors: Author[];
    formats: string[];
    partOrSectionInfo: string;
    publicationDates: string[];
    parentId?: string;
    subjects: string[];
    summary: string;
    shortTitle: string;
    subTitle?: string;

    constructor(zenonData : any) {
        this.id = zenonData.id;
        this.title = zenonData.title;
        this.authors = reformatAuthors(zenonData);
        this.formats = zenonData.formats;
        this.partOrSectionInfo = zenonData.partOrSectionInfo;
        this.publicationDates = zenonData.publicationDates;
        this.parentId = zenonData.parentId;
        this.subjects = zenonData.subjects;
        this.summary = zenonData.summary;
        this.shortTitle = zenonData.shortTitle;
        this.subTitle = zenonData.subTitle;
    }
}

export interface Author {
    name: string;
    type: AuthorTypes;
    orcId?: string;
}

enum AuthorTypes {
    Primary, Secondary, Corporate
}

function reformatAuthors(record: any) : Author[] {
    const authors: Author[] = [];

    const primaryAuthors = Object.keys(record.authors.primary);
    primaryAuthors.forEach(
        (author) => {
            authors.push({
                name: author,
                type: AuthorTypes.Primary
            });
        }
    );

    const secondaryAuthors = Object.keys(record.authors.secondary);
    secondaryAuthors.forEach(
        (author) => {
            authors.push({
                name: author,
                type: AuthorTypes.Secondary
            });
        }
    );

    const corporateAuthors = Object.keys(record.authors.corporate);
    corporateAuthors.forEach(
        (author) => {
            authors.push({
                name: author,
                type: AuthorTypes.Corporate
            });
        }
    );
    return <Author[]>authors;
}

export async function getRecord(zenonID: string): Promise<ZenonRecord> {
    const url: string = `${zenonBaseURL}${zenonAPIURL}record`;
    const params: object = {
        id: zenonID
    };
    return sendRequest('get', url, {}, params, true).then(
        response => new ZenonRecord(response.records[0])
    );
}
