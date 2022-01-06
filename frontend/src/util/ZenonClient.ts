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
    summary: string[];
    shortTitle: string;
    subTitle?: string;
    pages?: string;
    serialMetadata?: SerialMetadata;

    constructor(zenonData : any) {
        this.id = zenonData.id;
        this.title = zenonData.title;
        this.authors = reformatAuthors(zenonData);
        this.formats = zenonData.formats;
        this.publicationDates = zenonData.publicationDates;

        this.parentId = zenonData.parentId;
        this.subjects = zenonData.subjects.map((subject: string|string[]) => {
            if (Array.isArray(subject)) return subject.join(', ');
            return subject;
        });
        this.summary = zenonData.summary;
        this.shortTitle = zenonData.shortTitle.replace(/[\s:]+$/, '').trim();
        this.subTitle = zenonData.subTitle;
        this.pages = zenonData.containerPageRange;

        this.partOrSectionInfo = zenonData.partOrSectionInfo;
        if ('partOrSectionInfo' in zenonData) {
            this.serialMetadata = {
                issue: parseIssueNumber(zenonData.partOrSectionInfo),
                volume: parseVolumeNumber(zenonData.partOrSectionInfo),
                year: parseSerialYear(zenonData.partOrSectionInfo)
            };
        }
    }
}

export interface Author {
    name: string;
    type: AuthorTypes;
    orcId?: string;
}

export interface SerialMetadata {
    issue?: number;
    volume?: number;
    year?: number;
}

export enum AuthorTypes {
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

function parseIssueNumber(partOrSectionInfo: string): number | undefined {
    if (!partOrSectionInfo.includes(',')) {
        return undefined;
    }

    const match = partOrSectionInfo.match(/,[^(]*/g)!;
    if (match) {
        return parseInt(match[0].slice(1), 10);
    }
    return undefined;
}

function parseVolumeNumber(partOrSectionInfo: string): number | undefined {
    let match = null;
    if (partOrSectionInfo.includes(',')) {
        match = partOrSectionInfo.match(/[^,]*/g)!;
    } else {
        match = partOrSectionInfo.match(/[^(]*/g)!;
    }

    if (match) {
        return parseInt(match[0], 10);
    }
    return undefined;
}

function parseSerialYear(partOrSectionInfo: string): number | undefined {
    const match = partOrSectionInfo.match(/\(.*?\)/g)!;

    if (match) {
        return parseInt(match[0].slice(1, -1), 10);
    }
    return undefined;
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
