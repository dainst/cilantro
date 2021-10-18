import { ojsZenonMapping } from '@/config';
import {
    JobTargetData,
    JournalIssueMetadata
} from '@/job/ingest-journal/IngestJournalParameters';
import {
    MaybeJobTarget,
    MonographMetadata,
    Person
} from '@/job/ingest-monograph/IngestMonographParameters';
import { JobTargetError } from '@/job/JobParameters';
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
    monographMetadata: MonographMetadata;
    journalMetadata: JournalIssueMetadata;

    constructor(zenonData: any) {
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
        this.monographMetadata = this.loadMonographZenonData();
        this.journalMetadata = this.loadJournalZenonData();
    }

    loadMonographZenonData = (): MonographMetadata => {
        const filteredSubjects = this.subjects
            .map(subject => subject[0])
            .filter(filterDuplicateEntry);
        const authors = extractAuthors(this);

        const metadata = {
            zenon_id: this.id,
            press_code: 'dai',
            authors,
            title: this.shortTitle.replace(/[\s:]+$/, '').trim(),
            subtitle: getSubTitle(this),
            abstract: getSummary(this),
            date_published: getDatePublished(this),
            keywords: filteredSubjects
        } as MonographMetadata;
        return metadata;
    };

    loadJournalZenonData = (): JournalIssueMetadata => {
        const metadata = {
            zenon_id: this.id,
            volume: getSerialVolume(this),
            publishing_year: parseInt(this.publicationDates[0], 10),
            number: getIssueNumber(this),
            description: this.title,
            ojs_journal_code: this.parentId
                ? ojsZenonMapping[this.parentId]
                : '',
            reporting_year: getReportingYear(this)
        } as JournalIssueMetadata;
        return metadata;
    };
}

export interface Author {
    name: string;
    type: AuthorTypes;
    orcId?: string;
}

enum AuthorTypes {
    Primary,
    Secondary,
    Corporate
}

function reformatAuthors(record: any): Author[] {
    const authors: Author[] = [];

    const primaryAuthors = Object.keys(record.authors.primary);
    primaryAuthors.forEach((author) => {
        authors.push({
            name: author,
            type: AuthorTypes.Primary
        });
    });

    const secondaryAuthors = Object.keys(record.authors.secondary);
    secondaryAuthors.forEach((author) => {
        authors.push({
            name: author,
            type: AuthorTypes.Secondary
        });
    });

    const corporateAuthors = Object.keys(record.authors.corporate);
    corporateAuthors.forEach((author) => {
        authors.push({
            name: author,
            type: AuthorTypes.Corporate
        });
    });
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

function getDatePublished(zenonRecord: ZenonRecord) {
    let datePublished = '';

    if (zenonRecord.publicationDates.length > 0) {
        try {
            [datePublished] = new Date(zenonRecord.publicationDates[0])
                .toISOString()
                .split('T');
            // eslint-disable-next-line no-empty
        } catch (e) {}
    }
    return datePublished;
}
function getSummary(zenonRecord: ZenonRecord) {
    let summary = '';
    if (zenonRecord.summary.length > 0) {
        [summary] = zenonRecord.summary;
    }
    return summary;
}

function getSubTitle(zenonRecord: ZenonRecord) {
    let subTitle = '';
    if (zenonRecord.subTitle) {
        subTitle = zenonRecord.subTitle.trim();
    }
    return subTitle;
}
function filterDuplicateEntry<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}

function extractAuthors(record: ZenonRecord): Person[] {
    return record.authors.map((author: Author) => {
        const authorSplit = author.name.split(',');
        if (authorSplit.length === 2) {
            return {
                givenname: authorSplit[1].replace(/[\\.]+$/, '').trim(),
                lastname: authorSplit[0].trim()
            } as Person;
        }
        return {
            givenname: '',
            lastname: author.name
        } as Person;
    });
}

function getReportingYear(record: ZenonRecord): number {
    const match = record.partOrSectionInfo.match(/\(.*?\)/g)![0];
    return parseInt(match.slice(1, -1), 10);
}

function getIssueNumber(record: ZenonRecord): number {
    if (!record.partOrSectionInfo.includes(',')) {
        return 0;
    }
    const match = record.partOrSectionInfo.match(/,[^(]*/g)![0];
    return parseInt(match.slice(1), 10);
}

function getSerialVolume(record: ZenonRecord): number {
    let match: string = '';
    if (record.partOrSectionInfo.includes(',')) {
        [match] = record.partOrSectionInfo.match(/[^,]*/g)!;
    } else {
        [match] = record.partOrSectionInfo.match(/[^(]*/g)!;
    }
    return parseInt(match, 10);
}
