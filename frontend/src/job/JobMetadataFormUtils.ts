import { Book } from './ingest-book/BookImportParameters';
import { JournalIssue } from './ingest-journal/JournalImportParameters';
import { AtomRecord } from '@/util/AtomClient';
import { ZenonRecord } from '@/util/ZenonClient';
import { getStagingFiles, WorkbenchFileTree } from '@/staging/StagingClient';

export async function checkFolderStructure(records: ObjectRecord[]) {
    const stagingFiles = await getStagingFiles();
    return records.map((record) => {
        const folder = getStagingFile(stagingFiles, record.id);
        const msg = validateFolder(folder);
        if (msg) return buildError(record, msg);
        return record;
    });
}

export function getStagingFile(stagingFiles: WorkbenchFileTree, path: string) {
    return path.split('/').reduce((folderTree, folderName) => {
        if (folderName in folderTree) {
            return folderTree[folderName].contents || {};
        }
        return {};
    }, stagingFiles);
}

export function validateFolder(folder: WorkbenchFileTree) {
    if (Object.keys(folder).length !== 1) return "Folder has more than one entry. Only one subfolder 'tif' is allowed.";
    if (!('tif' in folder)) return "Folder does not have a subfolder 'tif'.";
    const tifFolder = folder.tif.contents;
    if (!tifFolder || Object.keys(tifFolder).length === 0) return "Subfolder 'tif' is empty.";
    const filesOk = Object.keys(tifFolder).reduce((ok, file) => ok && file.endsWith('.tif'), true);
    if (!filesOk) return "Subfolder 'tif' does not only contain files ending in '.tif'.";
    return false;
}

export function buildError(record: ObjectRecord, error: string): ObjectRecord {
    return {
        id: record.id,
        object: record.object,
        errors: record.errors.concat(error)
    };
}

export function getRowClass(record: ObjectRecord) {
    if (record.errors) return 'is-danger';
    if (record.remoteRecord) return 'is-success';
    return '';
}

export function getTableField(field: any) {
    return field || '-';
}

export interface ObjectRecord {
    id: string,
    object: Book | JournalIssue;
    remoteRecord?: AtomRecord | ZenonRecord;
    errors: string[];
}
