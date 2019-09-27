<template>
    <section>
        <b-table :data="records" detailed detail-key="id" :row-class="getRowClass">
            <template slot-scope="props">
                <b-table-column width="25">
                    <b-icon v-if="props.row.zenonRecord" icon="check" type="is-success" />
                    <b-icon v-if="props.row.error" icon="alert-circle" type="is-danger" />
                    <b-icon
                        v-if="!props.row.error && !props.row.zenonRecord"
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
            <template slot="detail" slot-scope="props">
                <pre v-if="props.row.zenonRecord">{{ props.row.zenonRecord }}</pre>
                <p v-if="props.row.error">{{ props.row.error }}</p>
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

    mounted() {
        const records = this.selectedPaths.map(path => initRecord(path));
        const updates: Promise<JournalIssue>[] = records.map((record) => {
            const i = this.records.push(record) - 1;
            return populateZenonRecord(record).then((populatedRecord) => {
                this.$set(this.records, i, populatedRecord);
                return populatedRecord.issue;
            });
        });
        Promise.all(updates).then(issues => this.$emit('update:issues', issues));
    }

    getRowClass = getRowClass;

    getTableField = getTableField;

    labelPosition: string = 'on-border';
}

interface Record {
    id: string,
    issue: JournalIssue;
    zenonRecord?: ZenonRecord;
    error?: string;
}

function extractZenonId(path: string): string | null {
    const result = path.match(/.*JOURNAL-ZID(\d+)/);
    if (!result || result.length < 1) return null;
    return result[1];
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

function getRowClass(record: Record) {
    if (record.error) return 'is-danger';
    if (record.zenonRecord) return 'is-success';
    return '';
}

function getTableField(field: any) {
    return field || '-';
}

function initRecord(path: string): Record {
    return { id: path, issue: initIssue(path) };
}

function buildRecord(record: Record, zenonRecord: ZenonRecord, ojsJournalCode: string): Record {
    return {
        id: record.id,
        issue: {
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
        zenonRecord
    };
}

function buildError(record: Record, error: string): Record {
    return {
        id: record.id,
        issue: record.issue,
        error
    };
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
