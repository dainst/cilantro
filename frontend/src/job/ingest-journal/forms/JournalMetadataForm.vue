<template>
    <section>
        <b-table :data="records" detailed detail-key="id" :row-class="getRowClass">
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon
                        v-if="props.row.zenonRecord && !props.row.errors.length"
                        icon="check"
                        type="is-success"
                    />
                    <b-icon v-if="props.row.errors.length" icon="alert-circle" type="is-danger" />
                    <b-icon
                        v-if="!props.row.errors.length && !props.row.zenonRecord"
                        icon="loading"
                        custom-class="mdi-spin"
                    />
                </b-table-column>
                <b-table-column field="id" label="Path">{{ props.row.id }}</b-table-column>
                <b-table-column
                    field="issue.metadata.description"
                    label="Description"
                >{{ props.row.issue.metadata.description || '-' | truncate(80) }}</b-table-column>
                <b-table-column
                    field="issue.metadata.volume"
                    label="Volume"
                >{{ props.row.issue.metadata.volume || '-' }}</b-table-column>
                <b-table-column
                    field="issue.metadata.year"
                    label="Year"
                >{{ props.row.issue.metadata.year || '-' }}</b-table-column>
                <b-table-column
                    field="issue.metadata.number"
                    label="Number"
                >{{ props.row.issue.metadata.number || '-' }}</b-table-column>
            </template>
            <template slot="detail" slot-scope="props" v-if="props.row.errors.length">
                <div class="content">
                    <ul>
                        <li v-for="error in props.row.errors" :key="error">{{ error }}</li>
                    </ul>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { JournalIssueMetadata, JournalIssue, initIssue } from '../JournalImportParameters';
import { getRecord, ZenonRecord } from '@/util/ZenonClient';
import { ojsZenonMapping } from '@/config';
import { getStagingFiles, WorkbenchFileTree } from '@/staging/StagingClient';

@Component({
    filters: {
        truncate(value: string, length: number) {
            return value.length > length
                ? `${value.substr(0, length)}...`
                : value;
        }
    }
})
export default class JournalMetadataForm extends Vue {
    @Prop({ required: true }) private selectedPaths!: string[];

    records: Record[] = [];

    async mounted() {
        this.records = this.selectedPaths.map(path => initRecord(path));
        this.records = await checkFolderStructure(this.records);
        this.records = await populateZenonRecords(this.records);
        this.$emit('update:issues', this.records.filter(r => !r.errors.length).map(r => r.issue));
    }

    getRowClass = getRowClass;

    getTableField = getTableField;

    labelPosition: string = 'on-border';
}

interface Record {
    id: string,
    issue: JournalIssue;
    zenonRecord?: ZenonRecord;
    errors: string[];
}

async function checkFolderStructure(records: Record[]) {
    const stagingFiles = await getStagingFiles();
    return records.map((record) => {
        const folder = getStagingFile(stagingFiles, record.id);
        const msg = validateFolder(folder);
        if (msg) return buildError(record, msg);
        return record;
    });
}

function getStagingFile(stagingFiles: WorkbenchFileTree, path: string) {
    return path.split('/').reduce((folderTree, folderName) => {
        if (folderName in folderTree) {
            return folderTree[folderName].contents || {};
        }
        return {};
    }, stagingFiles);
}

function validateFolder(folder: WorkbenchFileTree) {
    if (Object.keys(folder).length !== 1) return "Folder has more than one entry. Only one subfolder 'tif' is allowed.";
    if (!('tif' in folder)) return "Folder does not have a subfolder 'tif'.";
    const tifFolder = folder.tif.contents;
    if (!tifFolder || Object.keys(tifFolder).length === 0) return "Subfolder 'tif' is empty.";
    const filesOk = Object.keys(tifFolder).reduce((ok, file) => ok && file.endsWith('.tif'), true);
    if (!filesOk) return "Subfolder 'tif' does not only contain files ending in '.tif'.";
    return false;
}

async function populateZenonRecords(records: Record[]) {
    return Promise.all(records.map(async record => populateZenonRecord(record)));
}

async function populateZenonRecord(record: Record): Promise<Record> {
    const zenonId = extractZenonId(record.issue.path);
    if (!zenonId) {
        const msg = 'Invalid name. The folder path does not match the pattern "JOURNAL-ZIDxxxxxxx".';
        return buildError(record, msg);
    }
    try {
        const zenonRecord = await getRecord(zenonId);
        if (!zenonRecord.parentId) {
            const msg = `Zenon record has no parent id. Can't determine which Journal this issue belongs to.`;
            return buildError(record, msg);
        }
        if (!(zenonRecord.parentId in ojsZenonMapping)) {
            const msg = `Missing OJS Journal code for Journal with Zenon-ID '${zenonRecord.parentId}'.`;
            return buildError(record, msg);
        }
        const ojsJournalCode = ojsZenonMapping[zenonRecord.parentId];
        return buildRecord(record, zenonRecord, ojsJournalCode);
    } catch (error) {
        const msg = `No Record with the extracted ID "${zenonId}" found.`;
        return buildError(record, msg);
    }
}

function extractZenonId(path: string): string | null {
    const result = path.match(/.*JOURNAL-ZID(\d+)/);
    if (!result || result.length < 1) return null;
    return result[1];
}

function getRowClass(record: Record) {
    if (record.errors) return 'is-danger';
    if (record.zenonRecord) return 'is-success';
    return '';
}

function getTableField(field: any) {
    return field || '-';
}

function initRecord(path: string): Record {
    return { id: path, issue: initIssue(path), errors: [] };
}

function buildRecord(record: Record, zenonRecord: ZenonRecord, ojsJournalCode: string): Record {
    return {
        id: record.id,
        issue: {
            id: record.issue.id,
            path: record.issue.path,
            metadata: {
                zenon_id: parseInt(zenonRecord.id, 10),
                volume: 1,
                year: parseInt(zenonRecord.publicationDates[0], 10),
                number: 1,
                description: zenonRecord.title,
                ojs_journal_code: ojsJournalCode
            }
        },
        zenonRecord,
        errors: record.errors
    };
}

function buildError(record: Record, error: string): Record {
    return {
        id: record.id,
        issue: record.issue,
        errors: record.errors.concat(error)
    };
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
