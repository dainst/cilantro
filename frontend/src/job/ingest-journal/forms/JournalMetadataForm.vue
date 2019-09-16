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
        const updates = this.selectedPaths.map((path) => {
            const issue = initIssue(path);
            const record = { id: path, issue };
            const i = this.records.push(record) - 1;
            return populateZenonRecord(record).then((populatedRecord) => {
                Vue.set(this.records, i, populatedRecord);
                return populatedRecord.issue;
            });
        });
        Promise.all(updates).then((updatedIssues) => {
            this.$emit('issues-updated', updatedIssues);
        });
    }

    // eslint-disable-next-line class-methods-use-this
    getRowClass(record: Record) {
        if (record.error) return 'is-danger';
        if (record.zenonRecord) return 'is-success';
        return '';
    }

    // eslint-disable-next-line class-methods-use-this
    getTableField(field: any) {
        return field || '-';
    }

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
        return initError(record.id, record.issue, msg);
    }
    try {
        const zenonRecord = await getRecord(zenonId);
        return initRecord(record.id, record.issue.path, zenonRecord);
    } catch (error) {
        const msg = `No Record with the extracted ID "${zenonId}" found.`;
        return initError(record.id, record.issue, msg);
    }
}

function initRecord(id: string, path: string, zenonRecord: ZenonRecord) {
    return {
        id,
        issue: {
            path,
            metadata: {
                zenon_id: parseInt(zenonRecord.id, 10),
                volume: '',
                year: 0,
                number: '',
                description: zenonRecord.title,
                identification: ''
            }
        },
        zenonRecord
    };
}

function initError(id: string, issue: JournalIssue, error: string) {
    return { id, issue, error };
}

</script>

<style lang="scss" scoped>
.record-container {
    flex-wrap: wrap;
    padding-bottom: 2rem;
}
</style>
