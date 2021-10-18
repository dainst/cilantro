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
    }
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
export async function loadMonographZenonData(
    target: JobTargetData
): Promise<MaybeJobTarget> {
    try {
        const zenonRecord = (await getRecord(
            target.metadata.zenon_id
        )) as ZenonRecord;
        const errors: string[] = [];

        let datePublished = '';

        if (zenonRecord.publicationDates.length > 0) {
            try {
                [datePublished] = new Date(zenonRecord.publicationDates[0])
                    .toISOString()
                    .split('T');
            } catch (e) {
                errors.push(
                    `Unable to parse date: ${zenonRecord.publicationDates[0]}`
                );
            }
        }
        let summary = '';
        if (zenonRecord.summary.length > 0) {
            [summary] = zenonRecord.summary;
        }

        let subTitle = '';
        if (zenonRecord.subTitle) {
            subTitle = zenonRecord.subTitle.trim();
        }

        const filteredSubjects = zenonRecord.subjects
            .map(subject => subject[0])
            .filter(filterDuplicateEntry);
        const authors = extractAuthors(zenonRecord);

        if (errors.length !== 0) {
            return new JobTargetError(target.id, target.path, errors);
        }
        const metadata = {
            zenon_id: target.metadata.zenon_id,
            press_code: 'dai',
            authors,
            title: zenonRecord.shortTitle.replace(/[\s:]+$/, '').trim(),
            subtitle: subTitle,
            abstract: summary,
            date_published: datePublished,
            keywords: filteredSubjects
        } as MonographMetadata;

        return new JobTargetData(target.id, target.path, metadata);
    } catch (error) {
        return new JobTargetError(target.id, target.path, [error]);
    }
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
function getParentId(zenonRecord: ZenonRecord, errors: string[]) {
    let parentId = '';
    if (!zenonRecord.parentId) {
        errors.push(
            `Zenon record has no parent id. Can't determine which Journal this issue belongs to.`
        );
    } else if (!(zenonRecord.parentId in ojsZenonMapping)) {
        errors.push(
            `Missing OJS Journal code for Journal with Zenon-ID '${zenonRecord.parentId}'.`
        );
    } else {
        // eslint-disable-next-line prefer-destructuring
        parentId = zenonRecord.parentId;
    }
    return parentId;
}
export async function loadJournalZenonData(target: JobTargetData) {
    try {
        const zenonRecord = (await getRecord(
            target.metadata.zenon_id
        )) as ZenonRecord;
        const errors: string[] = [];

        if (errors.length !== 0) {
            return new JobTargetError(target.id, target.path, errors);
        }
        const parentId = getParentId(zenonRecord, errors);

        const metadata = {
            zenon_id: target.metadata.zenon_id,
            volume: getSerialVolume(zenonRecord),
            publishing_year: parseInt(zenonRecord.publicationDates[0], 10),
            number: getIssueNumber(zenonRecord),
            description: zenonRecord.title,
            ojs_journal_code: ojsZenonMapping[parentId],
            reporting_year: getReportingYear(zenonRecord)
        } as JournalIssueMetadata;

        return new JobTargetData(target.id, target.path, metadata);
    } catch (error) {
        return new JobTargetError(target.id, target.path, [error]);
    }
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
        // eslint-disable-next-line prefer-destructuring
        match = record.partOrSectionInfo.match(/[^,]*/g)![0];
    } else {
        // eslint-disable-next-line prefer-destructuring
        match = record.partOrSectionInfo.match(/[^(]*/g)![0];
    }
    return parseInt(match, 10);
}
