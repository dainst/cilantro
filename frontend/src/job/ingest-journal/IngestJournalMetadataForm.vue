<template>
    <section>
        <b-table :data="records" detailed detail-key="id" :row-class="getRowClass">
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon
                        v-if="props.row.remoteRecord && !props.row.errors.length"
                        icon="check"
                        type="is-success"
                    />
                    <b-icon v-if="props.row.errors.length" icon="alert-circle" type="is-danger" />
                    <b-icon
                        v-if="!props.row.errors.length && !props.row.remoteRecord"
                        icon="loading"
                        custom-class="mdi-spin"
                    />
                </b-table-column>
                <b-table-column field="id" label="Path">{{ props.row.id }}</b-table-column>
                <b-table-column
                    field="object.metadata.description"
                    label="Description"
                >{{ props.row.object.metadata.description || '-' | truncate(80) }}</b-table-column>
                <b-table-column
                    field="object.metadata.volume"
                    label="Volume"
                >{{ props.row.object.metadata.volume || '-' }}</b-table-column>
                <b-table-column
                    field="object.metadata.year"
                    label="Year"
                >{{ props.row.object.metadata.year || '-' }}</b-table-column>
                <b-table-column
                    field="object.metadata.number"
                    label="Number"
                >{{ props.row.object.metadata.number || '-' }}</b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="content">
                    <ul v-if="props.row.errors.length > 0">
                        <li v-for="error in props.row.errors" :key="error">{{ error }}</li>
                    </ul>
                    <div v-else>
                        No problems found for this folder path
                    </div>
                </div>
            </template>
        </b-table>
    </section>
</template>

<script lang="ts">
import {
    Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { initIssue } from './IngestJournalParameters';
import { getRecord, ZenonRecord } from '@/util/ZenonClient';
import { ojsZenonMapping } from '@/config';
import {
    checkFolderStructure, buildError, getRowClass, getTableField, ObjectRecord
} from '@/job/JobMetadataFormUtils.ts';

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

    records: ObjectRecord[] = [];

    async mounted() {
        this.records = this.selectedPaths.map(path => initRecord(path));
        this.records = await checkFolderStructure(this.records);
        this.records = await populateZenonRecords(this.records);
        this.$emit('update:issues', this.records.filter(r => !r.errors.length).map(r => r.object));
    }

    getRowClass = getRowClass;

    getTableField = getTableField;

    labelPosition: string = 'on-border';
}

async function populateZenonRecords(records: ObjectRecord[]) {
    return Promise.all(records.map(async record => populateZenonRecord(record)));
}

async function populateZenonRecord(record: ObjectRecord): Promise<ObjectRecord> {
    const zenonId = extractZenonId(record.object.path);
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

function buildRecord(record: ObjectRecord, zenonRecord: ZenonRecord, ojsJournalCode: string): ObjectRecord {
    return {
        id: record.id,
        object: {
            id: record.object.id,
            path: record.object.path,
            metadata: {
                zenon_id: parseInt(zenonRecord.id, 10),
                volume: parseVolumeFromContainerReference(zenonRecord.containerReference),
                publishing_year: parseInt(zenonRecord.publicationDates[0], 10),
                number: parseNumberFromContainerReference(zenonRecord.containerReference),
                description: zenonRecord.title,
                ojs_journal_code: ojsJournalCode,
                reporting_year: parseReportingYearFromContainerReference(
                    zenonRecord.containerReference
                )
            }
        },
        remoteRecord: zenonRecord,
        errors: record.errors
    };
}

function initRecord(path: string): ObjectRecord {
    return { id: path, object: initIssue(path), errors: [] };
}

function extractZenonId(path: string): string | null {
    const result = path.match(/.*JOURNAL-ZID(\d+)/);
    if (!result || result.length < 1) return null;
    return result[1];
}

function parseReportingYearFromContainerReference(containerReference: string): number {
    const match = containerReference.match(/\(.*?\)/g)![0];
    return parseInt(match.slice(1, -1), 10);
}

function parseNumberFromContainerReference(containerReference: string): number {
    if (!containerReference.includes(',')) {
        return 0;
    }
    const match = containerReference.match(/,[^(]*/g)![0];
    return parseInt(match.slice(1), 10);
}

function parseVolumeFromContainerReference(containerReference: string): number {
    let match: string = '';
    if (containerReference.includes(',')) {
        match = containerReference.match(/[^,]*/g)![0];
    } else {
        match = containerReference.match(/[^(]*/g)![0];
    }
    return parseInt(match, 10);
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
